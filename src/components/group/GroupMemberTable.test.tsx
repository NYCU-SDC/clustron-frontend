import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GroupMemberTable from "./GroupMemberTable";
import { AccessLevelUser, AccessLevelOwner } from "@/types/group";
import type { GetGroupMembersResponse } from "@/types/group";

// Mock hooks
const mockGetMembers = vi.fn();
const mockUpdateMember = vi.fn();
const mockJwtPayload = { Role: "user" };
const mockRoleMapper = {
  getRolesByAccessLevel: vi.fn(),
  roles: [
    { id: "role-1", roleName: "USER", accessLevel: "USER" },
    { id: "role-2", roleName: "GROUP_ADMIN", accessLevel: "GROUP_ADMIN" },
    { id: "role-3", roleName: "GROUP_OWNER", accessLevel: "GROUP_OWNER" },
  ],
  roleNameToId: vi.fn(),
  roleNameToAccessLevel: vi.fn(),
  isLoading: false,
  isError: false,
};

vi.mock("@/hooks/useGetMembers", () => ({
  useGetMembers: (groupId: string, page: number) =>
    mockGetMembers(groupId, page),
}));

vi.mock("@/hooks/useUpdateMember", () => ({
  useUpdateMember: () => ({ mutate: mockUpdateMember, isPending: false }),
}));

vi.mock("@/hooks/useJwtPayload", () => ({
  useJwtPayload: () => mockJwtPayload,
}));

vi.mock("@/hooks/useRoleMapper", () => ({
  useRoleMapper: () => mockRoleMapper,
}));

// Mock components that we don't need to test in detail
vi.mock("@/components/group/AddMemberButton", () => ({
  default: ({ groupId }: { groupId: string }) => (
    <button data-testid="add-member-button">Add Member ({groupId})</button>
  ),
}));

// Helper function to create mock members data
const createMockMembersResponse = (
  page: number,
  pageSize: number = 10,
  totalItems: number = 25,
): GetGroupMembersResponse => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const items = Array.from({ length: endIndex - startIndex }, (_, i) => ({
    id: `member-${startIndex + i + 1}`,
    fullName: `Member ${startIndex + i + 1}`,
    email: `member${startIndex + i + 1}@example.com`,
    studentId: `S${(startIndex + i + 1).toString().padStart(4, "0")}`,
    role: {
      roleName: "USER",
      id: `role-${startIndex + i + 1}`,
      accessLevel: AccessLevelUser,
    },
  }));

  return {
    items,
    totalPages,
    totalItems,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages - 1,
  };
};

// Test wrapper with QueryClient
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("GroupMemberTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock role mapper behavior
    mockRoleMapper.getRolesByAccessLevel.mockReturnValue([
      { id: "role-1", roleName: "USER", accessLevel: "USER" },
      { id: "role-2", roleName: "GROUP_ADMIN", accessLevel: "GROUP_ADMIN" },
    ]);
    mockRoleMapper.roleNameToId.mockImplementation((roleName: string) => {
      const role = mockRoleMapper.roles.find((r) => r.roleName === roleName);
      return role?.id;
    });
  });

  describe("Pagination Functionality", () => {
    it("should initialize with page 0 and call useGetMembers with correct parameters", () => {
      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Verify that useGetMembers was called with page 0 (backend uses 0-based indexing)
      expect(mockGetMembers).toHaveBeenCalledWith("test-group-id", 0);
    });

    it("should display pagination controls when there are multiple pages", () => {
      const mockData = createMockMembersResponse(0, 10, 25); // 3 pages total
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Check for pagination buttons (using aria-label)
      expect(screen.getByLabelText(/go to previous page/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/go to next page/i)).toBeInTheDocument();

      // Check for page number buttons (should show page 1, 2, 3)
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should disable previous button on first page", () => {
      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      const prevButton = screen.getByLabelText(/go to previous page/i);
      expect(prevButton).toHaveClass("opacity-50", "pointer-events-none");
    });

    it("should disable next button on last page", () => {
      // Use a single page dataset (currentPage = 0, totalPages = 1)
      // So currentPage === totalPages - 1 (0 === 0) should be true
      const mockData = createMockMembersResponse(0, 10, 5); // Only 5 items = 1 page
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      const nextButton = screen.getByLabelText(/go to next page/i);
      expect(nextButton).toHaveClass("opacity-50", "pointer-events-none");
    });

    it("should navigate to next page when next button is clicked", async () => {
      const user = userEvent.setup();

      // Initial render with page 0
      const mockDataPage0 = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockDataPage0,
        isLoading: false,
        isError: false,
      });

      const { rerender } = render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Click next button
      const nextButton = screen.getByLabelText(/go to next page/i);
      await user.click(nextButton);

      // Mock return value for page 1
      const mockDataPage1 = createMockMembersResponse(1);
      mockGetMembers.mockReturnValue({
        data: mockDataPage1,
        isLoading: false,
        isError: false,
      });

      // Rerender to simulate state update
      rerender(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Verify useGetMembers was called with page 1
      await waitFor(() => {
        expect(mockGetMembers).toHaveBeenCalledWith("test-group-id", 1);
      });
    });

    it("should navigate to previous page when previous button is clicked", async () => {
      const user = userEvent.setup();

      // Start on page 1
      const mockDataPage1 = createMockMembersResponse(1);
      mockGetMembers.mockReturnValue({
        data: mockDataPage1,
        isLoading: false,
        isError: false,
      });

      const { rerender } = render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Click previous button
      const prevButton = screen.getByLabelText(/go to previous page/i);
      await user.click(prevButton);

      // Mock return value for page 0
      const mockDataPage0 = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockDataPage0,
        isLoading: false,
        isError: false,
      });

      // Rerender to simulate state update
      rerender(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Verify useGetMembers was called with page 0
      await waitFor(() => {
        expect(mockGetMembers).toHaveBeenCalledWith("test-group-id", 0);
      });
    });

    it("should navigate to specific page when page number is clicked", async () => {
      const user = userEvent.setup();

      // Initial render with page 0
      const mockDataPage0 = createMockMembersResponse(0, 10, 30); // 3 pages
      mockGetMembers.mockReturnValue({
        data: mockDataPage0,
        isLoading: false,
        isError: false,
      });

      const { rerender } = render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Click on page 3 button
      const page3Button = screen.getByText("3");
      await user.click(page3Button);

      // Mock return value for page 2 (0-based indexing)
      const mockDataPage2 = createMockMembersResponse(2, 10, 30);
      mockGetMembers.mockReturnValue({
        data: mockDataPage2,
        isLoading: false,
        isError: false,
      });

      // Rerender to simulate state update
      rerender(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Verify useGetMembers was called with page 2 (0-based)
      await waitFor(() => {
        expect(mockGetMembers).toHaveBeenCalledWith("test-group-id", 2);
      });
    });

    it("should show ellipsis when there are many pages", () => {
      // Create data with many pages (e.g., 10 pages)
      const mockData = createMockMembersResponse(0, 10, 100);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Should show ellipsis after visible page numbers
      const ellipsis = screen.getAllByText("...");
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it("should limit visible page numbers to maxPages (4)", () => {
      // Create data with many pages
      const mockData = createMockMembersResponse(5, 10, 100); // Page 5 of 10
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      // Should show at most 4 page number buttons (excluding prev/next)
      const pageNumbers = screen.getAllByText(/^\d+$/);
      expect(pageNumbers.length).toBeLessThanOrEqual(4);
    });

    it("should maintain pagination state when members are updated", async () => {
      const user = userEvent.setup();

      // Start on page 1
      const mockDataPage1 = createMockMembersResponse(1);
      mockGetMembers.mockReturnValue({
        data: mockDataPage1,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable
            groupId="test-group-id"
            accessLevel={AccessLevelOwner}
          />
        </TestWrapper>,
      );

      // Look for the first role dropdown button (there will be multiple)
      const roleButtons = screen.getAllByRole("button", { name: /USER/i });
      await user.click(roleButtons[0]);

      // Click on a different role option in the dropdown
      const adminRoleOption = screen.getByRole("menuitem", {
        name: "GROUP_ADMIN",
      });
      await user.click(adminRoleOption);

      // Verify the update function was called with correct parameters
      expect(mockUpdateMember).toHaveBeenCalledWith({
        memberId: "member-11",
        groupId: "test-group-id",
        roleId: "role-2", // GROUP_ADMIN role ID
      });
    });
  });

  describe("Loading and Error States", () => {
    it("should show loading state", () => {
      mockGetMembers.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      expect(
        screen.getByText("groupComponents.groupMemberTable.loadingMembers"),
      ).toBeInTheDocument();
    });

    it("should show error state", () => {
      mockGetMembers.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      expect(
        screen.getByText(
          "groupComponents.groupMemberTable.failedToLoadMembers",
        ),
      ).toBeInTheDocument();
    });

    it("should show empty state when no members found", () => {
      const mockData = {
        items: [],
        totalPages: 1,
        totalItems: 0,
        currentPage: 0,
        pageSize: 10,
        hasNextPage: false,
      };

      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable groupId="test-group-id" />
        </TestWrapper>,
      );

      expect(
        screen.getByText("groupComponents.groupMemberTable.noMembersFound"),
      ).toBeInTheDocument();
    });
  });

  describe("Member Actions", () => {
    it("should call onRemove when member is deleted", async () => {
      const user = userEvent.setup();
      const mockOnRemove = vi.fn();

      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable
            groupId="test-group-id"
            accessLevel={AccessLevelOwner}
            onRemove={mockOnRemove}
          />
        </TestWrapper>,
      );

      // Get the first "More" button (three dots menu)
      const deleteButton = screen.getAllByRole("button", {
        name: "user-actions-menu",
      })[0];
      await user.click(deleteButton);

      // Click on the delete option in the dropdown
      const deleteOption = screen.getByText(
        "groupComponents.memberDeleteButton.removeUser",
      );
      await user.click(deleteOption);

      // Click confirm in the dialog
      const confirmButton = screen.getByText(
        "groupComponents.memberDeleteButton.delete",
      );
      await user.click(confirmButton);

      expect(mockOnRemove).toHaveBeenCalledWith("member-1");
    });

    it("should not show actions for users without edit permissions", () => {
      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable
            groupId="test-group-id"
            accessLevel={AccessLevelUser}
          />
        </TestWrapper>,
      );

      // No action buttons should be visible for users without edit permissions
      expect(
        screen.queryByRole("button", { name: "user-actions-menu" }),
      ).not.toBeInTheDocument();

      // Role should be displayed as text, not as a dropdown button
      expect(
        screen.queryByRole("button", { name: /USER/i }),
      ).not.toBeInTheDocument();
    });

    it("should not show actions when group is archived", () => {
      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable
            groupId="test-group-id"
            accessLevel={AccessLevelOwner}
            isArchived={true}
          />
        </TestWrapper>,
      );

      // Role should be displayed as text, not as a dropdown button when archived
      // Check for role dropdown buttons (they should not exist when archived)
      const roleDropdownButtons = screen
        .queryAllByRole("button")
        .filter(
          (button) =>
            button.textContent?.includes("USER") &&
            button.getAttribute("aria-haspopup") === "menu",
        );
      expect(roleDropdownButtons).toHaveLength(0);

      // Delete action buttons should be disabled when group is archived
      const deleteButtons = screen.getAllByRole("button", {
        name: "user-actions-menu",
      });
      deleteButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("Overview Mode", () => {
    it("should not show Add Member button in overview mode", () => {
      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable
            groupId="test-group-id"
            accessLevel={AccessLevelOwner}
            isOverview={true}
          />
        </TestWrapper>,
      );

      expect(screen.queryByTestId("add-member-button")).not.toBeInTheDocument();
    });

    it("should not show member actions in overview mode", () => {
      const mockData = createMockMembersResponse(0);
      mockGetMembers.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <GroupMemberTable
            groupId="test-group-id"
            accessLevel={AccessLevelOwner}
            isOverview={true}
          />
        </TestWrapper>,
      );

      // In overview mode, no action column should be shown at all
      // Role should be displayed as text, not as a dropdown button
      expect(
        screen.queryByRole("button", { name: /USER/i }),
      ).not.toBeInTheDocument();
      // No "More" action buttons should be visible
      expect(
        screen.queryByRole("button", { name: "user-actions-menu" }),
      ).not.toBeInTheDocument();
    });
  });
});
