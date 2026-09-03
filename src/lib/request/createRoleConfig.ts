import { api } from "@/lib/request/api";
import type { GroupRole, RoleConfigRequest } from "@/types/group";

export async function createRoleConfig(
  payload: RoleConfigRequest,
): Promise<GroupRole[]> {
  return api("/api/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
