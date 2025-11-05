import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveGroup } from "@/lib/request/archiveGroup";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type UseArchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useArchiveGroup(
  groupId: string,
  options?: UseArchiveGroupOptions,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toastId = `archive-group-${groupId}`;

  return useMutation({
    mutationFn: () => archiveGroup(groupId),
    onMutate: () => {
      toast.loading(t("groupPages.groupSettings.saving", "Saving..."), {
        id: toastId,
      });
    },
    onSuccess: async () => {
      toast.success(
        t(
          "groupPages.groupSettings.archiveSuccessToast",
          "Group archived successfully",
        ),
        { id: toastId },
      );
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group", groupId] as const });
      queryClient.invalidateQueries({ queryKey: ["groups"] as const });
    },
    onError: (err) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t(
          "groupPages.groupSettings.archiveFailToast",
          "Failed to archive group",
        );
      toast.error(msg, { id: toastId });
      options?.onError?.(err);
    },
  });
}
