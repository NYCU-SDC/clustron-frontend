import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroupLinks,
  createGroupLink,
  updateGroupLink,
  deleteGroupLink,
} from "@/lib/request/groupLinks";
import type { GroupLinkPayload, GroupLinkResponse } from "@/types/group";

// 🔸 Get all links
export function useGetGroupLinks(groupId: string) {
  return useQuery<GroupLinkResponse[]>({
    queryKey: ["GroupLinks", groupId],
    queryFn: () => getGroupLinks(groupId),
    enabled: !!groupId,
  });
}

// 🔸 Create link
export function useCreateGroupLink(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GroupLinkPayload) =>
      createGroupLink(groupId, payload),
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
