import { api } from "@/lib/request/api";
import type { GroupDetail, UpdateGroupTitleRequest } from "@/types/group";

export async function updateGroupTitle({
  groupId,
  payload,
}: {
  groupId: string;
  payload: UpdateGroupTitleRequest;
}): Promise<GroupDetail> {
  return api(`/api/groups/${groupId}/title`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
