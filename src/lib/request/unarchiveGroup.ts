import { api } from "@/lib/request/api";

export async function unarchiveGroup(groupId: string): Promise<void> {
  return api(`/api/groups/${groupId}/unarchive`, {
    method: "POST",
  });
}
