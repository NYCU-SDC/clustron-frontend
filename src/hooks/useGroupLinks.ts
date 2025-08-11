// hooks/useGroupLinks.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupLink } from "@/lib/request/groupLinks";
import type { GroupLinkPayload, GroupLinkResponse } from "@/types/group";

type Vars = { groupId: string; payload: GroupLinkPayload };

export function useCreateGroupLink(options?: {
  onSuccess?: (data: GroupLinkResponse) => void;
  onError?: (err: unknown) => void;
}) {
  const qc = useQueryClient();

  return useMutation<GroupLinkResponse, unknown, Vars>({
    mutationFn: createGroupLink,
    mutationKey: ["GroupLinks", "create"],
    onSuccess: (data, vars) => {
      qc.invalidateQueries({ queryKey: ["GroupLinks", vars.groupId] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      console.error("Failed to create group link:", err);
      options?.onError?.(err);
    },
  });
}
