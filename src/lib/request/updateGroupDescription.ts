import { api } from "@/lib/request/api";
import type { GroupDetail, UpdateGroupDescriptionRequest } from "@/types/group";

export async function updateGroupDescription({
  groupId,
  payload,
}: {
  groupId: string;
  payload: UpdateGroupDescriptionRequest;
}): Promise<GroupDetail> {
  return api(`/api/groups/${groupId}/description`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
