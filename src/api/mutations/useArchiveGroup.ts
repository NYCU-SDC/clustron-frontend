// src/api/mutations/useArchiveGroup.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveGroup } from "@/api/groups/archiveGroup";

type ArchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useArchiveGroup(options?: ArchiveGroupOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => archiveGroup(groupId),

    onSuccess: async (_, groupId) => {
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      options?.onSuccess?.();
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
