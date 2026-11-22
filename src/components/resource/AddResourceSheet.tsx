import { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createServer,
  healthCheckServer,
  serverQueryKeys,
} from "@/lib/request/resources";
import { getErrMessage } from "@/lib/errors";
import ResourceFormFields from "@/components/resource/ResourceFormFields";
import HostKeyTrustDialog from "@/components/resource/HostKeyTrustDialog";
import HealthCheckResultPanel from "@/components/resource/HealthCheckResultPanel";
import type {
  CreateResourceRequest,
  HealthCheckRequest,
  HealthCheckResponse,
  ResourceFormData,
} from "@/types/resource";

const emptyResourceFormData: ResourceFormData = {
  ansible_name: "",
  ip_address: "",
  ssh_config_host: "",
  private_ip: "",
  ssh_user: "",
  ssh_key_name: "",
  ansible_role: "",
  slurm_partition: "",
  cpu_cores: "",
  memory_mb: "",
  services: ["ldap"],
};

// "check" runs the health check only; "deploy" creates the server after a passing check.
type Intent = "check" | "deploy";

const checkToastId = "health-check-server";
const createToastId = "create-server";

export default function AddResourceSheet() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>(
    emptyResourceFormData,
  );
  const [healthResult, setHealthResult] = useState<HealthCheckResponse | null>(
    null,
  );
  const [trustedHostKey, setTrustedHostKey] = useState<string | null>(null);
  const [trustOpen, setTrustOpen] = useState(false);
  const intentRef = useRef<Intent>("check");
  const formRef = useRef<HTMLFormElement>(null);

  const reset = () => {
    setFormData(emptyResourceFormData);
    setHealthResult(null);
    setTrustedHostKey(null);
    setTrustOpen(false);
  };

  // Editing any field invalidates a previous check/trust: the connection may have changed.
  const handleFormChange = (next: ResourceFormData) => {
    setFormData(next);
    setHealthResult(null);
    setTrustedHostKey(null);
  };

  const buildCreatePayload = (hostKey?: string): CreateResourceRequest => ({
    ansible_name: formData.ansible_name,
    ssh_user: formData.ssh_user,
    ansible_role:
      formData.ansible_role as CreateResourceRequest["ansible_role"],
    ip_address: formData.ip_address || undefined,
    ssh_config_host: formData.ssh_config_host || undefined,
    private_ip: formData.private_ip || undefined,
    ssh_key_name: formData.ssh_key_name || undefined,
    slurm_partition: formData.slurm_partition || undefined,
    cpu_cores: formData.cpu_cores ? Number(formData.cpu_cores) : undefined,
    memory_mb: formData.memory_mb ? Number(formData.memory_mb) : undefined,
    host_key: hostKey || undefined,
  });

  const buildHealthPayload = (trusted?: string): HealthCheckRequest => ({
    ansible_name: formData.ansible_name,
    ip_address: formData.ip_address || undefined,
    ssh_config_host: formData.ssh_config_host || undefined,
    ssh_user: formData.ssh_user || undefined,
    ssh_key_name: formData.ssh_key_name || undefined,
    trusted_host_key: trusted || undefined,
  });

  const { mutate: submitCreateServer, isPending: creating } = useMutation({
    mutationFn: createServer,
    onMutate: () => {
      toast.loading(
        t("resourceComponents.createServer.creatingToast", "Adding node..."),
        { id: createToastId },
      );
    },
    onSuccess: () => {
      toast.success(
        t(
          "resourceComponents.createServer.createSuccessToast",
          "Node added successfully",
        ),
        { id: createToastId },
      );
      queryClient.invalidateQueries({ queryKey: serverQueryKeys.all });
      setOpen(false);
      reset();
    },
    onError: (err) => {
      toast.error(
        getErrMessage(
          err,
          t(
            "resourceComponents.createServer.createFailToast",
            "Failed to add node",
          ),
        ),
        { id: createToastId },
      );
    },
  });

  const { mutate: runHealthCheck, isPending: checking } = useMutation({
    mutationFn: (vars: { trusted?: string }) =>
      healthCheckServer(buildHealthPayload(vars.trusted)),
    onMutate: () => {
      toast.loading(
        t(
          "resourceComponents.healthCheck.checkingToast",
          "Checking connection...",
        ),
        { id: checkToastId },
      );
    },
    onSuccess: (res) => {
      setHealthResult(res);

      // Unknown or changed host key: ask the user to trust the fingerprint, then retry.
      if (res.host_key_status === "new" || res.host_key_status === "changed") {
        toast.dismiss(checkToastId);
        setTrustOpen(true);
        return;
      }

      if (res.ok) {
        toast.success(
          t(
            "resourceComponents.healthCheck.passToast",
            "Connection check passed",
          ),
          { id: checkToastId },
        );
        if (res.host_key_status === "ok" && res.host_key) {
          setTrustedHostKey(res.host_key);
        }
        if (intentRef.current === "deploy") {
          submitCreateServer(
            buildCreatePayload(res.host_key ?? trustedHostKey ?? undefined),
          );
        }
        return;
      }

      toast.error(
        res.detail ||
          t(
            "resourceComponents.healthCheck.failToast",
            "Connection check failed",
          ),
        { id: checkToastId },
      );
    },
    onError: (err) => {
      toast.error(
        getErrMessage(
          err,
          t(
            "resourceComponents.healthCheck.failToast",
            "Connection check failed",
          ),
        ),
        { id: checkToastId },
      );
    },
  });

  const busy = checking || creating;

  const startHealthCheck = () => {
    if (!formRef.current?.reportValidity()) return;
    intentRef.current = "check";
    runHealthCheck({ trusted: trustedHostKey ?? undefined });
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    intentRef.current = "deploy";
    runHealthCheck({ trusted: trustedHostKey ?? undefined });
  };

  const confirmTrust = () => {
    const key = healthResult?.host_key;
    if (!key) return;
    setTrustedHostKey(key);
    setTrustOpen(false);
    runHealthCheck({ trusted: key });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {t("resourceComponents.addResourceSheet.trigger")}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <form
          onSubmit={handleDeploy}
          ref={formRef}
          className="flex h-full flex-col"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {t("resourceComponents.addResourceSheet.title")}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 px-4">
            <ResourceFormFields
              formData={formData}
              onChange={handleFormChange}
              disabled={busy}
            />
            {healthResult ? (
              <div className="mt-4">
                <HealthCheckResultPanel result={healthResult} />
              </div>
            ) : null}
          </div>

          <SheetFooter className="flex-row justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={busy}>
                {t("common.cancel")}
              </Button>
            </SheetClose>
            <Button
              type="button"
              variant="secondary"
              onClick={startHealthCheck}
              disabled={busy}
            >
              {t("resourceComponents.addResourceSheet.healthCheck")}
            </Button>
            <Button type="submit" disabled={busy}>
              {t("resourceComponents.addResourceSheet.deploy")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>

      <HostKeyTrustDialog
        open={trustOpen}
        onOpenChange={setTrustOpen}
        onConfirm={confirmTrust}
        isPending={busy}
        status={healthResult?.host_key_status ?? "new"}
        fingerprint={healthResult?.fingerprint}
      />
    </Sheet>
  );
}
