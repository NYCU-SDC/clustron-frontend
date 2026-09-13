import { api } from "@/lib/request/api";
import type { UpdateGroupMemberRequest } from "@/types/group";

export async function updateMember({
  groupId,
  memberId,
  roleId,
}: UpdateGroupMemberRequest) {
  return api(`/api/groups/${groupId}/members/${memberId}`, {
    method: "PUT",
    body: JSON.stringify({ roleId }),
  });
}
