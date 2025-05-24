import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unarchiveGroup } from "@/lib/request/unarchiveGroup";

type UseUnarchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useUnarchiveGroup(
  groupId: string,
  options?: UseUnarchiveGroupOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unarchiveGroup(groupId),
    onSuccess: async () => {
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err) => {
      console.error("❌ Failed to unarchive group:", err);
      options?.onError?.(err);
    },
  });
}

// // src/api/mutations/useUnarchiveGroup.ts

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { unarchiveGroup } from "@/lib/request/unarchiveGroup";

// type UnarchiveGroupOptions = {
//   onSuccess?: () => void | Promise<void>;
//   onError?: (err: unknown) => void;
// };

// export function useUnarchiveGroup(options?: UnarchiveGroupOptions) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (groupId: string) => unarchiveGroup(groupId),

//     onSuccess: async (_, groupId) => {
//       await queryClient.invalidateQueries({ queryKey: ["groups"] });
//       await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
//       options?.onSuccess?.();
//     },

//     onError: (err) => {
//       options?.onError?.(err);
//     },
//   });
// }
