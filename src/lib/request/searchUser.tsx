import { api } from "@/lib/request/api";
import type { PaginatedResponse } from "@/types/group.ts";

export interface User {
  id: string;
  name: string;
  email: string;
  identifier: string;
}

// export interface PaginatedResponse<ItemType> {
//   items: ItemType[];
//   currentPage: number;
//   hasNextPage: boolean;
//   pageSize: number;
//   totalItems: number;
//   totalPages: number;
// }

export const searchUser = async (
  query: string,
  page?: number,
): Promise<PaginatedResponse<User>> => {
  if (!query) {
    return {
      items: [],
      currentPage: 0,
      hasNextPage: false,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
    };
  }
  let url = `/api/searchUser?query=${encodeURIComponent(query)}`;

  if (page !== undefined) {
    url += `&page=${page}`;
  }

  const responseData: PaginatedResponse<User> = await api(url);
  return responseData;
};
