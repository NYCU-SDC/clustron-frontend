import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePendingMember } from "@/lib/request/groupPendingMembers";
import type { UpdatePendingMemberInput } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useUpdatePendingMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (params: UpdatePendingMemberInput) =>
      updatePendingMember(params),
    onMutate: (params) => {
      const toastId = `update-pending:${groupId}:${String(params.id)}`;
      toast.loading(
        t("groupPages.pendingMembers.updatingToast", "Updating..."),
        { id: toastId },
      );
      return toastId;
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(
        t(
          "groupPages.pendingMembers.updateSuccessToast",
          "Pending member updated",
        ),
        { id: ctx },
      );
      queryClient.invalidateQueries({
        queryKey: ["pendingMembers", groupId] as const,
      });
    },
    onError: (err, _vars, ctx) => {
      const msg =
        err.message ||
        t(
          "groupPages.pendingMembers.updateFailToast",
          "Failed to update pending member",
        );
      toast.error(msg, { id: ctx });
    },
  });
}
