import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMember } from "@/lib/request/updateMember";
import type { UpdateGroupMemberInput } from "@/types/group";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getErrMessage } from "@/lib/errors";
import { pickIdPart } from "@/lib/pickId";

type Ctx = { toastId: string };

type TResp = Awaited<ReturnType<typeof updateMember>>;

export function useUpdateMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<TResp, unknown, UpdateGroupMemberInput, Ctx>({
    mutationFn: (params: UpdateGroupMemberInput) => updateMember(params),
    onMutate: (params) => {
      const idPart = pickIdPart(params);
      const toastId = `update-member-${groupId}-${idPart}`;
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
      const msg = getErrMessage(
        err,
        t(
          "groupComponents.memberUpdate.updateFailToast",
          "Failed to update member",
        ),
      );
      toast.error(msg, { id: ctx?.toastId });
    },
  });
}
