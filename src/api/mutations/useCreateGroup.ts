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
    mutationFn: async (payload: CreateGroupInput): Promise<GroupSummary> => {
      // 創建群組
      const newGroup = await createGroup(payload);

      const groupSummary: GroupSummary = {
        id: newGroup.id,
        title: newGroup.title,
        description: newGroup.description,
        isArchived: newGroup.isArchived,
        createdAt: newGroup.createdAt,
        updatedAt: newGroup.updatedAt,
        me: {
          role: {
            id: newGroup.me.role.id, // 來自 createGroup 中的 role.id
            role: newGroup.me.role.role, // 來自 createGroup 中的 role.role
            accessLevel: newGroup.me.role.accessLevel, // 來自 createGroup 中的 accessLevel
          },
        },
      };

      return groupSummary;
    },

    onSuccess: async (data) => {
      await options?.onSuccess?.();

      // ✅ 重新抓取課程列表
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
