import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePendingMember } from "@/lib/request/groupPendingMembers";
import type { RemovePendingMemberParams } from "@/types/group";
import { toast } from "sonner"; // [ADDED]
import { useTranslation } from "react-i18next";

type Ctx = { toastId: string };

export function useRemovePendingMember(groupId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, unknown, RemovePendingMemberParams, Ctx>({
    mutationFn: (params: RemovePendingMemberParams) =>
      removePendingMember(params),
    onMutate: (params) => {
      const idPart =
        (params as any)?.id ??
        (params as any)?.memberId ??
        (params as any)?.email ??
        "target";
      const toastId = `remove-pending-${groupId}-${String(idPart)}`;

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
      const msg =
        (err as any)?.detail ||
        (err as Error)?.message ||
        t(
          "groupPages.pendingMembers.removeFailToast",
          "Failed to remove pending member",
        );
      toast.error(msg, { id: ctx?.toastId });
    },
  });
}
