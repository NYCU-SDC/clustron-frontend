import { api } from "@/lib/request/api";
import type { UpdateGroupMemberInput } from "@/types/group";

export async function updateMember({
  groupId,
  memberId,
  roleId,
}: UpdateGroupMemberInput) {
  return api(`/api/groups/${groupId}/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roleId }),
  });
}
