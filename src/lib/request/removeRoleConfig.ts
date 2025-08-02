import { api } from "@/lib/request/api";

export async function removeRoleConfig(id: string): Promise<null> {
  return api(`/api/roles/${id}`, {
    method: "DELETE",
  });
}
