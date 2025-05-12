// src/api/groups/unarchiveGroup.ts

import { mockGroups } from "@/lib/mockGroups";

export async function unarchiveGroup(
  id: string,
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 300)); // 模擬延遲

  const group = mockGroups.find((g) => g.id === id);
  if (!group) {
    throw new Error("Group not found");
  }

  group.isArchived = false;
  group.updatedAt = new Date().toISOString();

  return { success: true };
}
