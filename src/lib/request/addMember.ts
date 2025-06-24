import {
  // AccessLevelOwner,
  // AccessLevelUser,
  type AddGroupMemberInput,
  type AddGroupMemberResponse,
} from "@/types/group";
import { api } from "@/lib/request/api";

export async function addMember(
  groupId: string,
  members: AddGroupMemberInput[],
): Promise<AddGroupMemberResponse[]> {
  return api(`/api/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ members }),
  });
}
