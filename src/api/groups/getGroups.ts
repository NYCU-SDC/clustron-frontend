// src/api/groups/getGroups.ts

import type { GroupRole, GroupSummary, PaginatedResponse } from "@/types/group";
import { mockGroups } from "@/lib/mockGroups";

// 模擬目前使用者的 accessLevel，真實應從 userContext 或登入狀態取得
const mockMeRole: GroupRole = {
  id: "temp-role-id",
  role: "creator",
  accessLevel: "admin", // 模擬為 admin 使用者
};

export async function getGroups(
  page: number = 1,
  size: number = 10,
  sort: "asc" | "desc" = "asc",
  sortBy: keyof GroupSummary = "title",
): Promise<PaginatedResponse<GroupSummary>> {
  console.log("[getGroups] called");
  await new Promise((r) => setTimeout(r, 500)); // 模擬延遲

  // 轉換 mockGroups -> GroupSummary[]
  const all: GroupSummary[] = mockGroups.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    isArchived: g.isArchived,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    me: {
      role: mockMeRole,
    },
  }));

  // 排序
  all.sort((a, b) => {
    const aVal = a[sortBy] ?? "";
    const bVal = b[sortBy] ?? "";
    return sort === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // 分頁
  const totalItems = all.length;
  const totalPages = Math.ceil(totalItems / size);
  const start = (page - 1) * size;
  const items = all.slice(start, start + size);

  return {
    items,
    totalPages,
    totalItems,
    currentPage: page,
    pageSize: size,
    hasNextPage: page < totalPages,
  };
}
