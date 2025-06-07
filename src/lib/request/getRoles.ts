// lib/request/getRoles.ts
import { api } from "@/lib/request/api";
import type { GroupRole } from "@/types/group";

export async function getRoles(): Promise<GroupRole[]> {
  return api<GroupRole[]>("/api/roles");
}
