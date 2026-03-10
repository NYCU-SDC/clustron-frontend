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
    it("should render the admin sidebar with correct links when user has admin role", async () => {
      vi.mocked(jwtDecode).mockReturnValue({ Role: "admin" });
      renderAdminLayout();

      // should ensure the sidebar already render
      await screen.findByText("adminSidebar.title");

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

    it("should redirect to home page when user is not an admin", async () => {
      vi.mocked(jwtDecode).mockReturnValue({ Role: "user" });
      renderAdminLayout();

      await waitFor(() => {
        expect(screen.getByText("Home Page Content")).toBeInTheDocument();
        expect(
          screen.queryByText("adminSidebar.title"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Navigation", async () => {
    it("should navigate to every sidebar link correctly", async () => {
      vi.mocked(jwtDecode).mockReturnValue({ Role: "admin" });
      const user = userEvent.setup();
      renderAdminLayout("/admin/config");

      // The SideBar uses an <aside> tag, which has the 'complementary' role
      // Change from getByRole to findByRole to ensure the sidebar has been render.
      const sidebar = await screen.findByRole("complementary");

      const sidebarLinks = sidebar.querySelectorAll("a");

      const sidebarNavLinks = Array.from(sidebarLinks).filter((link) => {
        const href = link.getAttribute("href");
        return href && href !== "/" && !href.startsWith("#");
      });

      expect(sidebarNavLinks.length).toBeGreaterThan(0);

      for (const link of sidebarNavLinks) {
        await user.click(link);

        await waitFor(() => {
          const notFoundText = screen.queryByText(/404 Not Found/i);
          expect(notFoundText).not.toBeInTheDocument();
        });
      }
    });
  });
});
