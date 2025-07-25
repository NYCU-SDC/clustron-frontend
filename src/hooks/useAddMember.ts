import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/lib/request/addMember";
import type {
  AddGroupMemberInput,
  AddGroupMemberResponse,
} from "@/types/group";

type UseAddMemberOptions = {
  onSuccess?: (data: AddGroupMemberResponse[]) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useAddMember(groupId: string, options?: UseAddMemberOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (members: AddGroupMemberInput[]) => addMember(groupId, members),
    onSuccess: async (data) => {
      await options?.onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err) => {
      console.error(" Failed to add member:", err);
      options?.onError?.(err);
    },
  });
}
