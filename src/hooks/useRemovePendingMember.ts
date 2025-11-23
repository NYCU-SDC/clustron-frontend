import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePendingMember } from "@/lib/request/groupPendingMembers";
import type { RemovePendingMemberParams } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useRemovePendingMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, RemovePendingMemberParams, string>({
    mutationFn: (params: RemovePendingMemberParams) =>
      removePendingMember(params),
    onMutate: (params) => {
      const toastId = `remove-pending-${groupId}-${String(params.id)}`;
      toast.loading(
        t("groupPages.pendingMembers.removingToast", "Removing..."),
        { id: toastId },
      );
      return toastId;
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(
        t(
          "groupPages.pendingMembers.removeSuccessToast",
          "Removed from pending list",
        ),
        { id: ctx },
      );
      queryClient.invalidateQueries({
        queryKey: ["pendingMembers", groupId],
      });
    },
    onError: (err, _vars, ctx) => {
      const msg =
        err.message ||
        t(
          "groupPages.pendingMembers.removeFailToast",
          "Failed to remove pending member",
        );
      toast.error(msg, { id: ctx });
    },
  });
}
