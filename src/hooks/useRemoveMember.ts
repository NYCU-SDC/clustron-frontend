// src/api/mutations/useRemoveMember.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/lib/request/removeMember";

type RemoveMemberOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useRemoveMember(
  groupId: string,
  options?: RemoveMemberOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMember(groupId, memberId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members", groupId] });
      options?.onSuccess?.();
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
