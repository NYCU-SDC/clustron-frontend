import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  discoverSystemGroups,
  getSystemGroupCandidates,
  registerSystemGroup,
  systemGroupQueryKeys,
} from "@/lib/request/systemGroups";
import type { SystemGroupCandidate } from "@/types/systemGroup";
import { getErrMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

const MAX_DESCRIPTION_LENGTH = 1024;

// Discovery is asynchronous: POST /discover returns 202 and the candidate list
// only updates once the background Ansible run re-reads /etc/group on every
// compute node. So after triggering it we poll the candidates endpoint for a
// window instead of refetching once against stale data.
const DISCOVER_POLL_WINDOW_MS = 60_000;
const DISCOVER_POLL_INTERVAL_MS = 3_000;

// A stable fingerprint of the candidate list, used to detect when a background
// discovery run has actually changed the data so we can stop polling early.
function candidatesSignature(list: SystemGroupCandidate[]): string {
  return JSON.stringify(
    list.map((c) => [
      c.name,
      c.gidNumber ?? null,
      c.registered,
      c.consistent,
      c.conflicts.length,
    ]),
  );
}

function isRegistrable(candidate: SystemGroupCandidate): boolean {
  return (
    !candidate.registered &&
    candidate.consistent &&
    candidate.conflicts.length === 0
  );
}

type RegisterSystemGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RegisterSystemGroupDialog({
  open,
  onOpenChange,
}: RegisterSystemGroupDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  // Timestamp until which we keep polling for freshly discovered candidates,
  // and the list fingerprint captured when discovery was triggered.
  const [pollUntil, setPollUntil] = useState(0);
  const preDiscoverSignature = useRef<string | null>(null);

  // Reset the form whenever the dialog is opened.
  useEffect(() => {
    if (open) {
      setSelectedName(null);
      setDescription("");
      setPollUntil(0);
      preDiscoverSignature.current = null;
    }
  }, [open]);

  const isDiscovering = pollUntil > Date.now();

  const {
    data: candidates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: systemGroupQueryKeys.candidates(),
    queryFn: getSystemGroupCandidates,
    enabled: open,
    refetchInterval: isDiscovering ? DISCOVER_POLL_INTERVAL_MS : false,
  });

  // Stop polling as soon as a discovery run changes the candidate list; the
  // time window is only a fallback for when discovery produces no change.
  useEffect(() => {
    if (!isDiscovering || preDiscoverSignature.current === null) return;
    if (candidatesSignature(candidates) !== preDiscoverSignature.current) {
      setPollUntil(0);
      preDiscoverSignature.current = null;
    }
  }, [candidates, isDiscovering]);

  const discover = useMutation({
    mutationFn: discoverSystemGroups,
    onMutate: () => {
      const toastId = "discover-system-groups";
      toast.loading(t("common.loading"), { id: toastId });
      return toastId;
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(t("systemGroupConfig.register.toastDiscoverStarted"), {
        id: ctx,
      });
      // Poll for a window while the background run re-reads the compute nodes,
      // stopping early once the list changes from this snapshot.
      preDiscoverSignature.current = candidatesSignature(candidates);
      setPollUntil(Date.now() + DISCOVER_POLL_WINDOW_MS);
      queryClient.invalidateQueries({
        queryKey: systemGroupQueryKeys.candidates(),
      });
    },
    onError: (err, _vars, ctx) => {
      toast.error(
        getErrMessage(err, t("systemGroupConfig.register.toastDiscoverFail")),
        { id: ctx },
      );
    },
  });

  const register = useMutation({
    mutationFn: (name: string) =>
      registerSystemGroup({
        name,
        description: description.trim() || undefined,
      }),
    onMutate: () => {
      const toastId = "register-system-group";
      toast.loading(t("common.loading"), { id: toastId });
      return toastId;
    },
    onSuccess: (group, _name, ctx) => {
      toast.success(
        t("systemGroupConfig.register.toastRegisterSuccess", {
          group: group.name,
        }),
        { id: ctx },
      );
      queryClient.invalidateQueries({ queryKey: systemGroupQueryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: systemGroupQueryKeys.candidates(),
      });
      onOpenChange(false);
    },
    onError: (err, _name, ctx) => {
      const status = err instanceof Error ? err.name : "";
      let message: string;
      if (status === "403") {
        message = t("systemGroupConfig.register.toastDenylisted");
      } else if (status === "404") {
        message = t("systemGroupConfig.register.toastNotDiscovered");
      } else if (status === "409") {
        message = t("systemGroupConfig.register.toastConflict");
      } else {
        message = getErrMessage(
          err,
          t("systemGroupConfig.register.toastRegisterFail"),
        );
      }
      toast.error(message, { id: ctx });
    },
  });

  const canRegister = !!selectedName && !register.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("systemGroupConfig.register.title")}</DialogTitle>
          <DialogDescription>
            {t("systemGroupConfig.register.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label>{t("systemGroupConfig.register.candidatesLabel")}</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => discover.mutate()}
              disabled={discover.isPending || isDiscovering}
            >
              {discover.isPending || isDiscovering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t("systemGroupConfig.register.rediscover")}
            </Button>
          </div>
          {isDiscovering && (
            <p className="text-muted-foreground text-xs">
              {t("systemGroupConfig.register.discovering")}
            </p>
          )}

          <div className="max-h-64 overflow-y-auto rounded-md border">
            {isLoading ? (
              <p className="text-muted-foreground p-4 text-sm">
                {t("systemGroupConfig.register.loading")}
              </p>
            ) : isError ? (
              <p className="p-4 text-sm text-red-500">
                {t("systemGroupConfig.register.loadFailed")}
              </p>
            ) : candidates.length === 0 ? (
              <p className="text-muted-foreground p-4 text-sm">
                {t("systemGroupConfig.register.empty")}
              </p>
            ) : (
              <RadioGroup
                value={selectedName ?? ""}
                onValueChange={setSelectedName}
                className="gap-0 divide-y"
              >
                {candidates.map((candidate) => {
                  const registrable = isRegistrable(candidate);
                  const selected = selectedName === candidate.name;
                  const itemId = `system-group-candidate-${candidate.name}`;
                  return (
                    <label
                      key={candidate.name}
                      htmlFor={itemId}
                      className={cn(
                        "flex items-start gap-3 px-3 py-2 text-sm",
                        registrable
                          ? "hover:bg-muted cursor-pointer"
                          : "cursor-not-allowed opacity-60",
                        selected && "bg-muted",
                      )}
                    >
                      <RadioGroupItem
                        id={itemId}
                        value={candidate.name}
                        disabled={!registrable}
                        className="mt-0.5"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-medium">
                            {candidate.name}
                          </span>
                          {candidate.consistent &&
                            candidate.gidNumber !== undefined && (
                              <Badge variant="secondary">
                                GID {candidate.gidNumber}
                              </Badge>
                            )}
                          {candidate.registered && (
                            <Badge variant="outline">
                              {t("systemGroupConfig.register.badgeRegistered")}
                            </Badge>
                          )}
                        </div>
                        {!candidate.registered && !candidate.consistent && (
                          <span className="text-xs text-amber-600">
                            {t("systemGroupConfig.register.inconsistentGid")}
                          </span>
                        )}
                        {!candidate.registered &&
                          candidate.conflicts.length > 0 && (
                            <span className="text-xs text-amber-600">
                              {t("systemGroupConfig.register.badgeConflict", {
                                name: candidate.conflicts[0].name,
                                server: candidate.conflicts[0].server,
                              })}
                            </span>
                          )}
                        {candidate.missingServers.length > 0 && (
                          <span className="text-muted-foreground text-xs">
                            {t("systemGroupConfig.register.missingServers", {
                              count: candidate.missingServers.length,
                            })}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="system-group-description">
              {t("systemGroupConfig.register.descriptionLabel")}
            </Label>
            <Textarea
              id="system-group-description"
              value={description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder={t(
                "systemGroupConfig.register.descriptionPlaceholder",
              )}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={() => selectedName && register.mutate(selectedName)}
            disabled={!canRegister}
          >
            {register.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("systemGroupConfig.register.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
