import { useQuery } from "@tanstack/react-query";
// import { getUsers } from "@/lib/request/getUsers";
import type { GetUsersParams } from "@/types/admin";

import type { GetUsersResponse } from "@/types/admin";
import {
  GlobalRoleUser,
  GlobalRoleOrganizer,
  GlobalRoleAdmin,
  type User,
} from "@/types/admin";

const roles = [GlobalRoleUser, GlobalRoleOrganizer, GlobalRoleAdmin];
const firstNames = [
  "王",
  "陳",
  "李",
  "張",
  "林",
  "James",
  "Alice",
  "Robert",
  "Grace",
  "Kevin",
];
const lastNames = [
  "小明",
  "志強",
  "雅婷",
  "美惠",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Lee",
];

// 產生 50 筆資料
const MOCK_GLOBAL_USERS: User[] = Array.from({ length: 50 }).map((_, index) => {
  const id = `uuid-${index + 1}`;
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const fullName = `${firstName}${lastName}`;

  // 隨機分配一個學生證編號，或是空字串
  const studentId = index % 7 === 0 ? "" : (110000000 + index).toString();

  return {
    id,
    fullName,
    studentId,
    email: `${id}@example.com`,
    role: roles[index % roles.length], // 讓三種角色平均分配
  };
});

// 🔹 模擬後端的 Filter 與 Pagination 邏輯
const getMockUsers = async (
  params: GetUsersParams,
): Promise<GetUsersResponse> => {
  const { page = 0, size = 20, search = "", role = "" } = params;

  // 1. 先做篩選
  const filtered = MOCK_GLOBAL_USERS.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.studentId.includes(search);
    const matchesRole = role === "" || user.role === role;
    return matchesSearch && matchesRole;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / size);

  // 2. 🔹 關鍵的分頁切片計算
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: size,
    hasNextPage: page < totalPages,
  };
};

export function useGetUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ["AdminUsers", params],
    // queryFn: () => getUsers(params),
    queryFn: () => getMockUsers(params),
    placeholderData: (prev) => prev,
  });
}
