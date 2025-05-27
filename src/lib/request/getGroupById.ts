import { api } from "@/lib/request/api";
import type { GroupDetail } from "@/types/group";

export async function getGroupById(id: string): Promise<GroupDetail> {
  return api(`/api/groups/${id}`);
}
