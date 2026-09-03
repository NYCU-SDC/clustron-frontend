import { api } from "@/lib/request/api";
import type { GroupRole, RoleConfigRequest } from "@/types/group";

export async function updateRoleConfig(
  id: string,
  payload: RoleConfigRequest,
): Promise<GroupRole[]> {
  return api(`/api/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
