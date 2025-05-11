// src/api/groups/createGroup.ts

import type { CreateGroupInput } from "@/types/group";

export async function createGroup(payload: CreateGroupInput) {
  // 模擬 1 秒延遲 + 假回應
  await new Promise((r) => setTimeout(r, 1000));

  return {
    id: `mock-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    me: {
      role: {
        id: "mock-role",
        role: "admin",
        accessLevel: "admin",
      },
    },
  };
}
