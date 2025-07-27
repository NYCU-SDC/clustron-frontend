import { api } from "@/lib/request/api";
import type { GroupRole } from "@/types/group";

export function getRoleConfig(): Promise<GroupRole> {
  return api("/api/roles");
}
