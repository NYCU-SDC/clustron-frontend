import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePendingMember } from "@/lib/request/groupPendingMembers";
import type { UpdatePendingMemberInput } from "@/types/group";

export function useUpdatePendingMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdatePendingMemberInput) =>
      updatePendingMember(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingMembers", groupId] });
    },
  });
}
