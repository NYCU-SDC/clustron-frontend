import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unarchiveGroup } from "@/lib/request/unarchiveGroup";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type UseUnarchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: Error) => void;
};

export function useUnarchiveGroup(
  groupId: string,
  options?: UseUnarchiveGroupOptions,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => unarchiveGroup(groupId),
    onMutate: () => {
      const toastId = `unarchive-group-${groupId}`;
      toast.loading(t("groupPages.groupSettings.saving", "Saving..."), {
        id: toastId,
      });
      return toastId;
    },
    onSuccess: async (_data, _vars, ctx) => {
      toast.success(
        t(
          "groupPages.groupSettings.unarchiveSuccessToast",
          "Group unarchived successfully",
        ),
        { id: ctx },
      );
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group", groupId] as const });
      queryClient.invalidateQueries({ queryKey: ["groups"] as const });
    },
    onError: (err, _vars, ctx) => {
      const msg =
        err.message ||
        t(
          "groupPages.groupSettings.unarchiveFailToast",
          "Failed to unarchive group",
        );
      toast.error(msg, { id: ctx });
      options?.onError?.(err);
    },
  });
}
