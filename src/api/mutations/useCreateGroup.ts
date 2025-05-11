// src/api/mutations/useCreateGroup.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/api/groups/createGroup";
import type {
  CreateGroupInput,
  GroupSummary,
  PaginatedResponse,
} from "@/types/group";

type CreateGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useCreateGroup(options?: CreateGroupOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupInput) => createGroup(payload),

    onMutate: async (newGroup) => {
      await queryClient.cancelQueries({ queryKey: ["groups"] });

      const previous = queryClient.getQueryData<
        PaginatedResponse<GroupSummary>
      >(["groups"]);

      const fakeGroup: GroupSummary = {
        id: `temp-${Date.now()}`,
        title: newGroup.title,
        description: newGroup.description,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        me: {
          role: {
            id: "temp-role",
            role: "creator",
            accessLevel: "user",
          },
        },
      };

      if (previous) {
        queryClient.setQueryData(["groups"], {
          ...previous,
          items: [fakeGroup, ...previous.items],
        });
      }

      return { previous };
    },

    onError: (err, _newGroup, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["groups"], context.previous);
      }

      // ✅ 呼叫傳進來的 onError（如果有）
      options?.onError?.(err);
    },

    onSuccess: async () => {
      // ✅ 呼叫傳進來的 onSuccess（如果有）
      await options?.onSuccess?.();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
