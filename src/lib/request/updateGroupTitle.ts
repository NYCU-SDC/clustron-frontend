import { api } from "@/lib/request/api";
import type { GroupDetail, UpdateGroupTitleInput } from "@/types/group";

export async function updateGroupTitle({
  groupId,
  payload,
}: {
  groupId: string;
  payload: UpdateGroupTitleInput;
}): Promise<GroupDetail> {
  return api(`/api/groups/${groupId}/title`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
