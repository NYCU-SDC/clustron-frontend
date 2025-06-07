import { api } from "@/lib/request/api";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";

type RawRole = {
  ID: string;
  Role: string;
  AccessLevel: string;
};

async function getRoles(): Promise<RawRole[]> {
  return api("/api/roles");
}

export async function createGroup(
  payload: CreateGroupInput,
): Promise<CreateGroupResponse> {
  const roles = await getRoles();
  // console.log("Submitting members:", JSON.stringify(payload.members, null, 2));
  const members = payload.members.map((m) => {
    const matched = roles.find((r) => r.Role === m.role);
    if (!matched) {
      throw new Error(`Invalid role name: ${m.role}`);
    }

    return {
      member: m.member,
      role: matched.ID,
    };
  });

  return api("/api/groups", {
    method: "POST",
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      members,
    }),
  });
}
