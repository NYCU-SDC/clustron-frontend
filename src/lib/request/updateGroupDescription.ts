import { api } from "@/lib/request/api";
import type { GroupDetail, UpdateGroupDescriptionInput } from "@/types/group";

export async function updateGroupDescription({
  groupId,
  payload,
}: {
  groupId: string;
  payload: UpdateGroupDescriptionInput;
}): Promise<GroupDetail> {
  return api(`/api/groups/${groupId}/description`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
