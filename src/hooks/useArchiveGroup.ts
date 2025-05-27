import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveGroup } from "@/lib/request/archiveGroup";

type UseArchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useArchiveGroup(
  groupId: string,
  options?: UseArchiveGroupOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveGroup(groupId),
    onSuccess: async () => {
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err) => {
      console.error("❌ Failed to archive group:", err);
      options?.onError?.(err);
    },
  });
}
