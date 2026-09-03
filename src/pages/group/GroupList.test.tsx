import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { authContext, type AuthContextType } from "@/lib/auth/authContext";
import type { GetGroupsResponse } from "@/types/group";
import GroupListPage from "@/pages/group/GroupList";

const mockGetGroups = vi.fn();

vi.mock("@/hooks/useGetGroups", () => ({
  useGetGroups: (page: number) => mockGetGroups(page),
}));

vi.mock("@/hooks/useGlobalPermissions", () => ({
  useGlobalPermissions: () => ({ canCreateGroup: false }),
}));

function createGroupsResponse(page: number): GetGroupsResponse {
  return {
    items: [
      {
        id: `group-${page}`,
        title: `Group page ${page + 1}`,
        ldapGroupName: `group-page-${page + 1}`,
        description: `Description for page ${page + 1}`,
        isArchived: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ],
    totalPages: 3,
    totalItems: 3,
    currentPage: page,
    pageSize: 1,
    hasNextPage: page < 2,
  };
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const authValue = {
    isLoggedIn: () => true,
  } as AuthContextType;

  return render(
    <QueryClientProvider client={queryClient}>
      <authContext.Provider value={authValue}>
        <MemoryRouter>
          <GroupListPage />
        </MemoryRouter>
      </authContext.Provider>
    </QueryClientProvider>,
  );
}

describe("GroupListPage pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetGroups.mockImplementation((page: number) => ({
      data: createGroupsResponse(page),
      isLoading: false,
      isError: false,
    }));
  });

  it("loads the first page initially", () => {
    renderPage();

    expect(mockGetGroups).toHaveBeenCalledWith(0);
    expect(screen.getByText("Group page 1")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "pagination" }),
    ).toBeVisible();
  });

  it("loads the next page when the next button is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByLabelText("Go to next page"));

    expect(mockGetGroups).toHaveBeenLastCalledWith(1);
    expect(screen.getByText("Group page 2")).toBeInTheDocument();
  });
});
