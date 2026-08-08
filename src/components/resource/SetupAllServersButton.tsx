import { useState } from "react";
import { RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getErrMessage } from "@/lib/errors";
import { setupAllServers, serverQueryKeys } from "@/lib/request/resources";
import ConfirmActionDialog from "@/components/resource/ConfirmActionDialog";

export default function SetupAllServersButton() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toastId = "setup-all-servers";
  const { mutate: setupAll, isPending } = useMutation({
    mutationFn: setupAllServers,
    onMutate: () => {
      toast.loading(
        t(
          "resourceComponents.setupAllServers.settingUpToast",
          "Setting up all nodes...",
        ),
        { id: toastId },
      );
    },
    onSuccess: () => {
      toast.success(
        t(
          "resourceComponents.setupAllServers.setupSuccessToast",
          "Setup started for all nodes",
        ),
        { id: toastId },
      );
      queryClient.invalidateQueries({ queryKey: serverQueryKeys.all });
      setConfirmOpen(false);
    },
    onError: (err) => {
      toast.error(
        getErrMessage(
          err,
          t(
            "resourceComponents.setupAllServers.setupFailToast",
            "Failed to set up all nodes",
          ),
        ),
        { id: toastId },
      );
    },
  });

  return (
    <>
      <Button type="button" onClick={() => setConfirmOpen(true)}>
        <RotateCw className="h-4 w-4" />
        {t("resourceComponents.setupAllServers.trigger", "Setup All Nodes")}
      </Button>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => setupAll()}
        isPending={isPending}
        variant="default"
        title={t(
          "resourceComponents.setupAllServers.confirmTitle",
          "Setup all nodes?",
        )}
        description={t(
          "resourceComponents.setupAllServers.confirmDescription",
          "This will trigger the setup process for every node in the cluster.",
        )}
        confirmLabel={t(
          "resourceComponents.setupAllServers.trigger",
          "Setup All Nodes",
        )}
      />
    </>
  );
}
