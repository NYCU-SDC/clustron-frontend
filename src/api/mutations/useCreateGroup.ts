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
      console.log("Creating group with data:", payload); // 確認傳入的資料

      // 創建群組
      const newGroup = await createGroup(payload);

      console.log("New group created:", newGroup); // 確認創建後的群組資料

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

      console.log("Group summary:", groupSummary); // 確認 groupSummary 是否正確

      return groupSummary;
    },

    onSuccess: async (data) => {
      console.log("onSuccess triggered with data:", data); // 確認 onSuccess 是否被觸發

      await options?.onSuccess?.();

      // ✅ 重新抓取課程列表
      queryClient.invalidateQueries({ queryKey: ["groups"] });

      console.log("Group created successfully:", data);
    },

    onError: (err) => {
      console.error("Error in creating group:", err); // 在錯誤時輸出更多信息
      options?.onError?.(err);
    },
  });
}
