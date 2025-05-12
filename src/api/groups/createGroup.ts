// src/api/groups/createGroup.ts

import { mockGroups } from "@/lib/mockGroups";
import type { CreateGroupInput } from "@/types/group";

export async function createGroup(payload: CreateGroupInput) {
  await new Promise((r) => setTimeout(r, 1000));

  const id = `mock-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const newGroup = {
    id,
    title: payload.title,
    description: payload.description,
    isArchived: false,
    createdAt,
    updatedAt: createdAt,
    members: [], // ✅ 初始為空
  };

  mockGroups.unshift(newGroup); // ✅ push 進 mock 資料

  return {
    id,
    title: newGroup.title,
    description: newGroup.description,
    isArchived: newGroup.isArchived,
    createdAt: newGroup.createdAt,
    updatedAt: newGroup.updatedAt,
    me: {
      role: {
        id: `mock-role-${id}`,
        role: "test-creator",
        accessLevel: "organizer",
      },
    },
  };
}
