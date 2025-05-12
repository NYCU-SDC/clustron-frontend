// src/api/mutations/useUnarchiveGroup.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unarchiveGroup } from "@/api/groups/unarchiveGroup";

type UnarchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useUnarchiveGroup(options?: UnarchiveGroupOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => unarchiveGroup(groupId),

    onSuccess: async (_, groupId) => {
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      await queryClient.invalidateQueries({ queryKey: ["group", groupId] }); // ✅
      options?.onSuccess?.();
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
