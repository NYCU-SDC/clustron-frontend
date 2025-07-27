import { api } from "@/lib/request/api";
import type { GroupRole, RoleConfigInput } from "@/types/group";

export async function createRoleConfig(
  payload: RoleConfigInput,
): Promise<GroupRole[]> {
  return api("/api/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
