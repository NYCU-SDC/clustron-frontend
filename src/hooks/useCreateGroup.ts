import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/request/createGroup";
import type { CreateGroupInput, GroupSummary } from "@/types/group";

type CreateGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useCreateGroup(options?: CreateGroupOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateGroupInput): Promise<GroupSummary> => {
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
            id: newGroup.me.role.id,
            role: newGroup.me.role.role,
            accessLevel: newGroup.me.role.accessLevel,
          },
        },
      };

      return groupSummary;
    },

    onSuccess: async (data) => {
      await options?.onSuccess?.();

      queryClient.invalidateQueries({ queryKey: ["groups"] });

      console.log("Group created successfully:", data);
    },

    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
