// =========================
// PaginatedResponse
// =========================
export interface PaginatedResponse<ItemType> {
  items: ItemType[];
  currentPage: number;
  hasNextPage: boolean;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// =========================
// API Error
// =========================
export interface ApiError extends Error {
  status: number;
  message: string;
  data?: unknown;
}
