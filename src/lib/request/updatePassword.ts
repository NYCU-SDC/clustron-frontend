import { api } from "@/lib/request/api";

export async function updatePassword(newPassword: string): Promise<void> {
  return api("/api/password", {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  });
}
