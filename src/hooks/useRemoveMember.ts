import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/lib/request/removeMember";

type UseRemoveMemberOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useRemoveMember(
  groupId: string,
  options?: UseRemoveMemberOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMember(groupId, memberId),
    onSuccess: async () => {
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err) => {
      console.error(" Failed to remove member:", err);
      options?.onError?.(err);
    },
  });
}
