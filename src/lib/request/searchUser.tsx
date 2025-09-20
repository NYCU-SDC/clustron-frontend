import { api } from "@/lib/request/api";

export interface PaginatedResponse<ItemType> {
  items: ItemType[];
  currentPage: number;
  hasNextPage: boolean;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const searchUser = async <T,>(
  query: string,
  page?: number,
): Promise<PaginatedResponse<T>> => {
  if (!query) {
    return {
      items: [],
      currentPage: 0,
      hasNextPage: false,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
    } as PaginatedResponse<T>;
  }
  let url = `/api/searchUser?query=${encodeURIComponent(query)}`;

  if (page !== undefined) {
    url += `&page=${page}`;
  }

  const responseData: PaginatedResponse<T> = await api(url);
  return responseData;
};
