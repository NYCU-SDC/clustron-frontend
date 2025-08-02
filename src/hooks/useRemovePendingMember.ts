import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePendingMember } from "@/lib/request/groupPendingMembers";
import type { RemovePendingMemberParams } from "@/types/group";

export function useRemovePendingMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RemovePendingMemberParams) =>
      removePendingMember(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingMembers", groupId] });
    },
  });
}
