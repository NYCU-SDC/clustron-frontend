import { api } from "@/lib/request/api";
import type {
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from "@/types/admin";

export async function updateGlobalRole({
  id,
  role,
}: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse> {
  return api<UpdateUserRoleResponse>(`/api/users/${id}/globalRole`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}
