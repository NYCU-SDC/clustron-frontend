// src/api/mutations/useAddMember.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/lib/request/addMember";

type AddMemberRequest = {
  member: string;
  role: string;
};

type AddMemberOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useAddMember(groupId: string, options?: AddMemberOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (members: AddMemberRequest[]) => addMember(groupId, members),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members", groupId] });
      options?.onSuccess?.();
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
