import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMember } from "@/lib/request/updateMember";

interface UseUpdateMemberOptions {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}

export function useUpdateMember(
  groupId: string,
  options?: UseUpdateMemberOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, roleId }: { memberId: string; roleId: string }) =>
      updateMember(groupId, memberId, roleId),
    onSuccess: async () => {
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
    },
    onError: (err) => {
      console.error("❌ Failed to update member:", err);
      options?.onError?.(err);
    },
  });
}
