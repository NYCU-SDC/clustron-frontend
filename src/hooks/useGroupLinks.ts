import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGroupLink,
  updateGroupLink,
  deleteGroupLink,
} from "@/lib/request/groupLinks";
import type { GroupLinkPayload } from "@/types/group";

// 🔸 Create link
export function useCreateGroupLink(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createGroupLink(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GroupLinks", groupId] });
    },
  });
}

// 🔸 Update link
export function useUpdateGroupLink(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      linkId,
      payload,
    }: {
      linkId: string;
      payload: GroupLinkPayload;
    }) => updateGroupLink(groupId, linkId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GroupLinks", groupId] });
    },
  });
}

// 🔸 Delete link
export function useDeleteGroupLink(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: string) => deleteGroupLink(groupId, linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GroupLinks", groupId] });
    },
  });
}
