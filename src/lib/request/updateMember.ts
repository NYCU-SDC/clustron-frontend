import { api } from "@/lib/request/api";
import type {
  UpdateGroupMemberInput,
  UpdateGroupMemberResponse,
} from "@/types/group";

export async function updateMember(
  groupId: string,
  memberId: string,
  input: UpdateGroupMemberInput,
): Promise<UpdateGroupMemberResponse> {
  return api(`/api/groups/${groupId}/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}
