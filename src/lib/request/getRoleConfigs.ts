import { api } from "@/lib/request/api";
import { GroupRole } from "@/types/group";

export function getRoleConfigs(): Promise<GroupRole[]> {
  return api("/api/roles");
}
