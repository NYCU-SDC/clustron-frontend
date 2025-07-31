import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMember } from "@/lib/request/updateMember";
import type { UpdateGroupMemberInput } from "@/types/group";

export function useUpdateMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateGroupMemberInput) => updateMember(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GroupMember", groupId] });
    },
  });
}
