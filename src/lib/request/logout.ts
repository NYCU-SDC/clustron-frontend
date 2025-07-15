import { api } from "@/lib/request/api";

export async function logout() {
  return api("/api/logout");
}
