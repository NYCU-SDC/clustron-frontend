import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrMessage } from "@/lib/errors";
import {
  RESOURCE_ROLE_OPTIONS,
  type AnsibleRole,
  type Server,
} from "@/types/resource";
import {
  getAllowedLoginGroups,
  updateAllowedLoginGroups,
  updateServerRole,
  resetServer as resetServerRequest,
  deleteServer as deleteServerRequest,
  serverQueryKeys,
} from "@/lib/request/resources";
import ResourceStatusBadge from "@/components/resource/ResourceStatusBadge";
import AllowedLoginGroupsField from "@/components/resource/AllowedLoginGroupsField";
import ConfirmActionDialog from "@/components/resource/ConfirmActionDialog";

type Props = {
  server: Server;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="break-all text-right font-medium">{value || "—"}</span>
    </div>
  );
}

export default function ResourceDetailSheet({
  server,
  open,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [role, setRole] = useState<AnsibleRole>(server.ansible_role);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: allowedGroups } = useQuery({
    queryKey: serverQueryKeys.allowedLoginGroups,
    queryFn: getAllowedLoginGroups,
  });

  useEffect(() => {
    if (open) {
      setRole(server.ansible_role);
      setGroupIds((allowedGroups ?? []).map((g) => g.groupId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, server.id, allowedGroups]);

  const { mutateAsync: updateRoleAsync, isPending: isUpdatingRole } =
    useMutation({
      mutationFn: (ansible_role: AnsibleRole) =>
        updateServerRole(server.id, { ansible_role }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: serverQueryKeys.all });
        queryClient.invalidateQueries({
          queryKey: serverQueryKeys.detail(server.id),
        });
      },
      onError: (err) => {
        toast.error(
          getErrMessage(
            err,
            t("resourceComponents.updateServerRole.updateFailToast"),
          ),
        );
      },
    });

  const { mutateAsync: updateGroupsAsync, isPending: isUpdatingGroups } =
    useMutation({
      mutationFn: (nextGroupIds: string[]) =>
        updateAllowedLoginGroups({ groupIds: nextGroupIds }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: serverQueryKeys.allowedLoginGroups,
        });
      },
      onError: (err) => {
        toast.error(
          getErrMessage(
            err,
            t("resourceComponents.updateAllowedLoginGroups.updateFailToast"),
          ),
        );
      },
    });

  const resetToastId = `reset-server-${server.id}`;
  const { mutate: resetServer, isPending: isResetting } = useMutation({
    mutationFn: () => resetServerRequest(server.id),
    onMutate: () => {
      toast.loading(
        t("resourceComponents.resetServer.resettingToast", "Resetting node..."),
        { id: resetToastId },
      );
    },
    onSuccess: () => {
      toast.success(
        t("resourceComponents.resetServer.resetSuccessToast", "Node reset"),
        { id: resetToastId },
      );
      queryClient.invalidateQueries({ queryKey: serverQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: serverQueryKeys.detail(server.id),
      });
      setResetConfirmOpen(false);
    },
    onError: (err) => {
      toast.error(
        getErrMessage(err, t("resourceComponents.resetServer.resetFailToast")),
        { id: resetToastId },
      );
    },
  });

  const deleteToastId = `delete-server-${server.id}`;
  const { mutate: deleteServer, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteServerRequest(server.id),
    onMutate: () => {
      toast.loading(
        t("resourceComponents.deleteServer.deletingToast", "Deleting..."),
        { id: deleteToastId },
      );
    },
    onSuccess: () => {
      toast.success(
        t("resourceComponents.deleteServer.deleteSuccessToast", "Node deleted"),
        { id: deleteToastId },
      );
      queryClient.invalidateQueries({ queryKey: serverQueryKeys.all });
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(
        getErrMessage(
          err,
          t("resourceComponents.deleteServer.deleteFailToast"),
        ),
        { id: deleteToastId },
      );
    },
  });

  const isSaving = isUpdatingRole || isUpdatingGroups;

  const handleSave = async () => {
    try {
      const tasks: Promise<unknown>[] = [updateGroupsAsync(groupIds)];
      if (role !== server.ansible_role) {
        tasks.push(updateRoleAsync(role));
      }
      await Promise.all(tasks);
      toast.success(
        t("resourceComponents.detailSheet.saveSuccessToast", "Changes saved"),
      );
      onOpenChange(false);
    } catch {
      // individual mutations already surface their own error toasts
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl">{server.ansible_name}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4">
            <ResourceStatusBadge status={server.status} />

            <div className="rounded-md border">
              <DetailRow
                label={t("resourceComponents.form.name")}
                value={server.ansible_name}
              />
              <DetailRow
                label={t("resourceComponents.form.ipAddress")}
                value={server.ip_address}
              />
              <DetailRow
                label={t("resourceComponents.form.sshConfigHost")}
                value={server.ssh_config_host}
              />
              <DetailRow
                label={t("resourceComponents.form.privateIp")}
                value={server.private_ip}
              />
              <DetailRow
                label={t("resourceComponents.form.sshUser")}
                value={server.ssh_user}
              />
              <DetailRow
                label={t("resourceComponents.form.sshKeyName")}
                value={server.ssh_key_name}
              />
              <DetailRow
                label={t("resourceComponents.form.cpuCores")}
                value={server.cpu_cores?.toString()}
              />
              <DetailRow
                label={t("resourceComponents.form.memoryMb")}
                value={server.memory_mb?.toString()}
              />
              <DetailRow
                label={t("resourceComponents.form.slurmPartition")}
                value={server.slurm_partition}
              />
            </div>

            {server.provision_detail && (
              <Accordion
                type="single"
                collapsible
                className="rounded-md border"
              >
                <AccordionItem value="provision-detail" className="border-b-0">
                  <AccordionTrigger className="px-4 py-3 text-sm text-muted-foreground hover:no-underline">
                    {t("resourceComponents.form.provisionDetail")}
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p className="whitespace-pre-wrap wrap-break-word text-sm">
                      {server.provision_detail}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <div className="grid gap-2">
              <Label>{t("resourceComponents.form.role")}</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as AnsibleRole)}
                disabled={isSaving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {t(r.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AllowedLoginGroupsField
              selectedGroupIds={groupIds}
              onChange={setGroupIds}
            />
          </div>

          <SheetFooter className="flex-row items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetConfirmOpen(true)}
                disabled={isResetting}
              >
                {t("resourceComponents.detailSheet.resetNode")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-rose-500 text-rose-500 hover:bg-rose-50 hover:text-rose-500"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isDeleting}
              >
                {t("resourceComponents.detailSheet.delete")}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                {t("common.cancel")}
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving
                  ? t("common.saving")
                  : t("resourceComponents.detailSheet.saveChanges")}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmActionDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        onConfirm={() => resetServer()}
        isPending={isResetting}
        variant="default"
        title={t("resourceComponents.detailSheet.resetConfirmTitle")}
        description={t(
          "resourceComponents.detailSheet.resetConfirmDescription",
        )}
        confirmLabel={t("resourceComponents.detailSheet.resetNode")}
      />

      <ConfirmActionDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => deleteServer()}
        isPending={isDeleting}
        variant="destructive"
        title={t("resourceComponents.detailSheet.deleteConfirmTitle")}
        description={t(
          "resourceComponents.detailSheet.deleteConfirmDescription",
        )}
        confirmLabel={t("resourceComponents.detailSheet.delete")}
      />
    </>
  );
}
