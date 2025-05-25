import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveGroup } from "@/lib/request/archiveGroup";

type UseArchiveGroupOptions = {
  onSuccess?: () => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function useArchiveGroup(
  groupId: string,
  options?: UseArchiveGroupOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveGroup(groupId),
    onSuccess: async () => {
      await options?.onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err) => {
      console.error("❌ Failed to archive group:", err);
      options?.onError?.(err);
    },
  });
}

// // src/api/mutations/useArchiveGroup.ts

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { archiveGroup } from "@/lib/request/archiveGroup";

// type ArchiveGroupOptions = {
//   onSuccess?: () => void | Promise<void>;
//   onError?: (err: unknown) => void;
// };

// export function useArchiveGroup(options?: ArchiveGroupOptions) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (groupId: string) => archiveGroup(groupId),

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
