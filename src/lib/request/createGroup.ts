import { api } from "@/lib/request/api";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";

export async function createGroup(
  payload: CreateGroupInput,
): Promise<CreateGroupResponse> {
  return api("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
