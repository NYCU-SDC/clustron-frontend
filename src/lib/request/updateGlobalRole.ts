import { api } from "@/lib/request/api";
import type {
  UpdateUserRoleInput,
  UpdateUserRoleResponse,
} from "@/types/admin";

export async function updateGlobalRole({
  id,
  role,
}: UpdateUserRoleInput): Promise<UpdateUserRoleResponse> {
  return api<UpdateUserRoleResponse>(`/api/users/${id}/globalRole`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}
