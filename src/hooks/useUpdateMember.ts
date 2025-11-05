import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMember } from "@/lib/request/updateMember";
import type { UpdateGroupMemberInput } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Ctx = { toastId: string };

type TResp = Awaited<ReturnType<typeof updateMember>>;

export function useUpdateMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<TResp, unknown, UpdateGroupMemberInput, Ctx>({
    mutationFn: (params: UpdateGroupMemberInput) => updateMember(params),
    onMutate: (params) => {
      const idPart =
        (params as any)?.memberId ??
        (params as any)?.id ??
        (params as any)?.email ??
        "target";
      const toastId = `update-member-${groupId}-${String(idPart)}`;
      toast.loading(
        t("groupComponents.memberUpdate.updatingToast", "Updating..."),
        { id: toastId },
      );
      return { toastId };
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(
        t("groupComponents.memberUpdate.updateSuccessToast", "Member updated"),
        { id: ctx?.toastId },
      );
      queryClient.invalidateQueries({
        queryKey: ["GroupMember", groupId] as const,
      });
      queryClient.invalidateQueries({
        queryKey: ["group-members", groupId] as const,
      });
    },
    onError: (err, _vars, ctx) => {
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t(
          "groupComponents.memberUpdate.updateFailToast",
          "Failed to update member",
        );
      toast.error(msg, { id: ctx?.toastId });
    },
  });
}
