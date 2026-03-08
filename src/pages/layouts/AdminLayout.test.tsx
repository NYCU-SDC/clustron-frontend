import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AdminLayout from "./AdminLayout";
import type * as ReactCookie from "react-cookie";

// 1. Setup Mocks (Mocking providers' dependencies)
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

// Mock APIs for pages inside the layout to prevent 401s
vi.mock("@/lib/request/getRoleConfigs", () => ({
  getRoleConfigs: vi.fn(async () => []),
}));
vi.mock("@/lib/request/getUsers", () => ({
  getUsers: vi.fn(async () => ({ items: [], totalPages: 0 })),
}));

describe("AdminLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderAdminLayout(initialRoute = "/admin/config") {
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

    return render(
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <AuthProvider>
              <Routes>
                <Route path="/admin" element={<AdminLayout />}>
                  {/* Semantic mock components for navigation verification */}
                  <Route
                    path="config"
                    element={<div>Role Config Page Content</div>}
                  />
                  <Route
                    path="users"
                    element={<div>User Config Page Content</div>}
                  />
                </Route>
                <Route path="/" element={<div>Home Page Content</div>} />
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  describe("Security & Visibility", () => {
    it("should render the admin sidebar when user has admin role", async () => {
      vi.mocked(jwtDecode).mockReturnValue({ Role: "admin" });
      renderAdminLayout();

      await waitFor(() => {
        expect(screen.getByText("adminSidebar.title")).toBeInTheDocument();
      });
    });

    it("should redirect to home page when user is not an admin", async () => {
      vi.mocked(jwtDecode).mockReturnValue({ Role: "user" });
      renderAdminLayout();

      await waitFor(() => {
        // App.tsx logic: non-admins are redirected back to "/" or away from /admin
        expect(screen.getByText("Home Page Content")).toBeInTheDocument();
        expect(
          screen.queryByText("adminSidebar.title"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to every sidebar link correctly", async () => {
      vi.mocked(jwtDecode).mockReturnValue({ Role: "admin" });
      const user = userEvent.setup();
      renderAdminLayout("/admin/config");

      await waitFor(() => screen.getByText("adminSidebar.title"));

      // Test User Configuration Link
      const userLink = screen.getByText("adminSidebar.userConfigLink");
      await user.click(userLink);
      expect(screen.getByText("User Config Page Content")).toBeInTheDocument();

      // Test Role Configuration Link
      const roleLink = screen.getByText("adminSidebar.roleAccessConfigLink");
      await user.click(roleLink);
      expect(screen.getByText("Role Config Page Content")).toBeInTheDocument();
    });
  });
});
