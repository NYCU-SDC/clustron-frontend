import { api } from "@/lib/request/api";

export async function removeMember(
  groupId: string,
  memberId: string,
): Promise<void> {
  return api(`/api/groups/${groupId}/members/${memberId}`, {
    method: "DELETE",
  });
}
