import { api } from "@/lib/request/api";

export async function archiveGroup(groupId: string): Promise<void> {
  return api(`/api/groups/${groupId}/archive`, {
    method: "POST",
  });
}
