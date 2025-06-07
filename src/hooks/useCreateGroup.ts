import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/request/createGroup";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";

export function useCreateGroup(options?: {
  onSuccess?: (data: CreateGroupResponse) => void;
  onError?: (err: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<CreateGroupResponse, unknown, CreateGroupInput>({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      console.error("Failed to create group:", err);
      options?.onError?.(err);
    },
  });
}

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createGroup } from "@/lib/request/createGroup";
// import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";
//
// type UseCreateGroupOptions = {
//   onSuccess?: (data: CreateGroupResponse) => void | Promise<void>;
//   onError?: (error: unknown) => void;
// };
//
// export function useCreateGroup(options?: UseCreateGroupOptions) {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: async (input: CreateGroupInput) => {
//       console.log(input);
//       return createGroup(input);
//     },
//     onSuccess: async (data) => {
//       await options?.onSuccess?.(data);
//       queryClient.invalidateQueries({ queryKey: ["groups"] });
//     },
//     onError: (error) => {
//       console.error("❌ Failed to create group:", error);
//       options?.onError?.(error);
//     },
//   });
// }
