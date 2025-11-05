import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePendingMember } from "@/lib/request/groupPendingMembers";
import type { RemovePendingMemberParams } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrMessage } from "@/lib/errors";
import { pickIdPart } from "@/lib/pickId";

type Ctx = { toastId: string };

export function useRemovePendingMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, unknown, RemovePendingMemberParams, Ctx>({
    mutationFn: (params: RemovePendingMemberParams) =>
      removePendingMember(params),
    onMutate: (params) => {
      const idPart = pickIdPart(params);
      const toastId = `remove-pending-${groupId}-${idPart}`;
      toast.loading(
        t("groupPages.pendingMembers.removingToast", "Removing..."),
        { id: toastId },
      );
      return { toastId };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(
        t(
          "groupPages.pendingMembers.removeSuccessToast",
          "Removed from pending list",
        ),
        { id: ctx?.toastId },
      );
      queryClient.invalidateQueries({
        queryKey: ["pendingMembers", groupId] as const,
      });
    },
    onError: (err, _vars, ctx) => {
      const msg = getErrMessage(
        err,
        t(
          "groupPages.pendingMembers.removeFailToast",
          "Failed to remove pending member",
        ),
      );
      toast.error(msg, { id: ctx?.toastId });
    },
  });
}
