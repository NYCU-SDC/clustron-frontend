import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/request/createGroup";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";

type UseCreateGroupOptions = {
  onSuccess?: (data: CreateGroupResponse) => void | Promise<void>;
  onError?: (error: unknown) => void;
};

export function useCreateGroup(options?: UseCreateGroupOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGroupInput) => {
      return await createGroup(input);
    },
    onSuccess: async (data) => {
      await options?.onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      console.error("❌ Failed to create group:", error);
      options?.onError?.(error);
    },
  });
}
