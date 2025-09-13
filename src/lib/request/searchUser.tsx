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
): Promise<PaginatedResponse<T>> => {
  const responseData: PaginatedResponse<T> = await api(
    `/api/searchUser?query=${encodeURIComponent(query)}`,
  );
  return responseData;
};
