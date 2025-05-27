import { api } from "@/lib/request/api";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";

export async function createGroup(
  payload: CreateGroupInput,
): Promise<CreateGroupResponse> {
  const members = payload.members.map((m) => ({
    member: m.member,
    role: m.role,
  }));

  return api("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      members,
    }),
  });
}
