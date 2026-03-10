import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect, Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import GroupLayout from "./GroupLayout";
import type * as ReactCookie from "react-cookie";

vi.mock("react-cookie", async () => {
  const mod = await vi.importActual<typeof ReactCookie>("react-cookie");
  return { ...mod, useCookies: vi.fn() };
});

vi.mock("jwt-decode", () => ({ jwtDecode: vi.fn() }));
vi.mock("@/lib/token", () => ({ getAccessToken: vi.fn() }));
vi.mock("@/lib/request/logout", () => ({ logout: vi.fn() }));
vi.mock("@/lib/request/refreshAuthToken", () => ({
  refreshAuthToken: vi.fn(async () => ({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expirationTime: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

vi.mock("@/hooks/useGetGroupById", () => ({
  useGetGroupById: vi.fn(),
}));

describe("GroupLayout", () => {
  const mockGroup = { id: "123", title: "Engineering Team Cluster" };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetGroupById as Mock).mockReturnValue({
      data: mockGroup,
      isLoading: false,
      isError: false,
    });
  });

  function renderGroupLayout(initialRoute = "/groups/123") {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(useCookies).mockReturnValue([
      { refreshToken: "mock-refresh" },
      vi.fn(),
      vi.fn(),
      vi.fn(),
    ]);
    vi.mocked(getAccessToken).mockReturnValue("mock-token");
    vi.mocked(jwtDecode).mockReturnValue({ Role: "user" });

    return render(
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <AuthProvider>
              <Routes>
                <Route path="/groups/:id" element={<GroupLayout />}>
                  <Route index element={<div>Group Overview Content</div>} />
                  <Route
                    path="settings"
                    element={<div>Group Settings Content</div>}
                  />
                </Route>
                {/* Redirect target */}
                <Route path="/groups" element={<div>Groups List Page</div>} />
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  describe("Data Loading & Error States", () => {
    it("should render the group title and all navigation links in the sidebar when data is loaded", async () => {
      renderGroupLayout();
      await screen.findByText(mockGroup.title);

      const sidebar = screen.getByRole("complementary");
      const navLinks = Array.from(sidebar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && !href.startsWith("#");
        },
      );

      expect(navLinks.length).toBe(2);

      navLinks.forEach((link) => {
        expect(link.getAttribute("href")).toBeTruthy();
        expect(link.textContent).toBeTruthy();
      });
    });

    it("should redirect to group list if the group fetch fails", async () => {
      (useGetGroupById as Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
      });

      renderGroupLayout();

      // Verify we were redirected to the Groups page defined in our test routes
      const redirectPage = await screen.findByText("Groups List Page");
      expect(redirectPage).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate correctly between dynamic group sub-pages", async () => {
      const user = userEvent.setup();
      renderGroupLayout();

      await screen.findByText(mockGroup.title);

      const settingsLink = screen.getByText(
        /groupComponents\.groupSideBar\.groupSettings/i,
      );
      await user.click(settingsLink);
      expect(screen.getByText("Group Settings Content")).toBeInTheDocument();

      const overviewLink = screen.getByText(
        /groupComponents\.groupSideBar\.overview/i,
      );
      await user.click(overviewLink);
      expect(screen.getByText("Group Overview Content")).toBeInTheDocument();
    });
  });
});
