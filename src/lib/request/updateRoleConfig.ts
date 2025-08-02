import { api } from "@/lib/request/api";
import type { GroupRole, RoleConfigInput } from "@/types/group";

export async function updateRoleConfig(
  id: string,
  payload: RoleConfigInput,
): Promise<GroupRole[]> {
  return api(`/api/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
