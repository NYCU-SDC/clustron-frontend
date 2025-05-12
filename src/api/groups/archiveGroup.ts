// src/api/groups/archiveGroup.ts

import { mockGroups } from "@/lib/mockGroups";

export async function archiveGroup(id: string): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 300)); // 模擬延遲

  const group = mockGroups.find((g) => g.id === id);
  if (!group) {
    throw new Error("Group not found");
  }

  group.isArchived = true;
  group.updatedAt = new Date().toISOString();

  return { success: true };
}
