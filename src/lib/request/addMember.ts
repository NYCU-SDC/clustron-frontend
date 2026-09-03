import {
  // AccessLevelOwner,
  // AccessLevelUser,
  type AddGroupMemberRequest,
  type AddMembersResult,
} from "@/types/group";
import { api } from "@/lib/request/api";

export async function addMember(
  groupId: string,
  members: AddGroupMemberRequest[],
): Promise<AddMembersResult> {
  return api(`/api/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ members }),
  });
}
