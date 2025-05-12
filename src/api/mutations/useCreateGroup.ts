// src/api/mutations/useCreateGroup.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/api/groups/createGroup";
import type { CreateGroupInput, GroupSummary } from "@/types/group";

type CreateGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useCreateGroup(options?: CreateGroupOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupInput): Promise<GroupSummary> =>
      createGroup(payload),

    onSuccess: async () => {
      await options?.onSuccess?.();

      // ✅ 重新抓取課程列表
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
