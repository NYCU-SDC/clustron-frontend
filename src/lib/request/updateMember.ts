import { api } from "@/lib/request/api";

export async function updateMember(
  groupId: string,
  memberId: string,
  roleId: string,
) {
  return api(`/api/groups/${groupId}/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roleId }),
  });
}
