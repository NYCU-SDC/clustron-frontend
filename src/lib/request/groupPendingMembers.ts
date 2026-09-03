import { api } from "@/lib/request/api";
import type {
  GetPendingMembersResponse,
  RemovePendingMemberRequest,
  UpdatePendingMemberRequest,
  UpdatePendingMemberResponse,
} from "@/types/group";

// GET
export async function getPendingMembers(
  groupId: string,
  page = 1,
): Promise<GetPendingMembersResponse> {
  return api(`/api/groups/${groupId}/pendingMembers?page=${page}`);
}

// PUT
export async function updatePendingMember({
  id,
  pendingId,
  roleId,
}: UpdatePendingMemberRequest): Promise<UpdatePendingMemberResponse> {
  return api(`/api/groups/${id}/pendingMembers/${pendingId}`, {
    method: "PUT",
    body: JSON.stringify({ roleId }),
  });
}

// DELETE
export async function removePendingMember({
  id,
  pendingId,
}: RemovePendingMemberRequest): Promise<void> {
  return api(`/api/groups/${id}/pendingMembers/${pendingId}`, {
    method: "DELETE",
  });
}
