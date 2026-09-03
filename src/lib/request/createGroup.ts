import { api } from "@/lib/request/api";
import type { CreateGroupRequest, CreateGroupResponse } from "@/types/group";

export async function createGroup(
  payload: CreateGroupRequest,
): Promise<CreateGroupResponse> {
  return api("/api/groups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
