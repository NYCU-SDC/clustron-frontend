import type { GroupSummary, PaginatedResponse } from "@/types/group";
import { mockGroups } from "@/lib/mockGroups";

export async function getGroups(
  page = 1,
  size = 10,
  sort: "asc" | "desc" = "asc",
  sortBy: keyof GroupSummary = "title",
  accessLevel: "admin" | "organizer" | "groupAdmin" | "user" = "user",
): Promise<PaginatedResponse<GroupSummary>> {
  await new Promise((r) => setTimeout(r, 500));

  const all: GroupSummary[] = mockGroups.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    isArchived: g.isArchived,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    me: {
      role: {
        id: "mock-role-id",
        role: "creator",
        accessLevel, // ✅ 根據傳入的 user 權限
      },
    },
  }));

  // 排序、分頁同原本
  all.sort((a, b) => {
    const aVal = a[sortBy] ?? "";
    const bVal = b[sortBy] ?? "";
    return sort === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

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
