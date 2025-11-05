import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePendingMember } from "@/lib/request/groupPendingMembers";
import type { UpdatePendingMemberInput } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrMessage } from "@/lib/errors";
import { pickIdPart } from "@/lib/pickId";

type Ctx = { toastId: string };
type TResp = Awaited<ReturnType<typeof updatePendingMember>>;

export function useUpdatePendingMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<TResp, unknown, UpdatePendingMemberInput, Ctx>({
    mutationFn: (params: UpdatePendingMemberInput) =>
      updatePendingMember(params),
    onMutate: (params) => {
      const toastId = `update-pending-${groupId}-${pickIdPart(params)}`;
      toast.loading(
        t("groupPages.pendingMembers.updatingToast", "Updating..."),
        { id: toastId },
      );
      return { toastId };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(
        t(
          "groupPages.pendingMembers.updateSuccessToast",
          "Pending member updated",
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
          "groupPages.pendingMembers.updateFailToast",
          "Failed to update pending member",
        ),
      );
      toast.error(msg, { id: ctx?.toastId });
    },
  });
}
