import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePendingMember } from "@/lib/request/groupPendingMembers";
import type { UpdatePendingMemberInput } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Ctx = { toastId: string };
type TResp = Awaited<ReturnType<typeof updatePendingMember>>;

export function useUpdatePendingMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<TResp, unknown, UpdatePendingMemberInput, Ctx>({
    mutationFn: (params: UpdatePendingMemberInput) =>
      updatePendingMember(params),
    onMutate: (params) => {
      const idPart =
        (params as any)?.id ??
        (params as any)?.memberId ??
        (params as any)?.email ??
        "target";
      const toastId = `update-pending-${groupId}-${String(idPart)}`;

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
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t(
          "groupPages.pendingMembers.updateFailToast",
          "Failed to update pending member",
        );
      toast.error(msg, { id: ctx?.toastId });
    },
  });
}
