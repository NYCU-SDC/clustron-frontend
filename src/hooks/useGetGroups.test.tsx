import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetGroups } from "@/hooks/useGetGroups";
import { getGroups } from "@/lib/request/getGroups";
import type { GetGroupsParams, GetGroupsResponse } from "@/types/group";

vi.mock("@/lib/request/getGroups", () => ({
  getGroups: vi.fn(),
}));

const response: GetGroupsResponse = {
  items: [],
  totalPages: 0,
  totalItems: 0,
  currentPage: 2,
  pageSize: 25,
  hasNextPage: false,
};

describe("useGetGroups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forwards all query parameters to getGroups", async () => {
    const params: GetGroupsParams = {
      page: 2,
      size: 25,
      sort: "desc",
      sortBy: "created_at",
    };
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(getGroups).mockResolvedValue(response);

    const { result } = renderHook(() => useGetGroups(params), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getGroups).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(response);
  });
});
