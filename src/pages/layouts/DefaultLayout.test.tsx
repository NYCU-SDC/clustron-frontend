import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import DefaultLayout from "./DefaultLayout";

// 1. Setup Global Mocks
vi.mock("react-cookie", async () => {
  const mod = await vi.importActual<any>("react-cookie");
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

describe("DefaultLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderDefaultLayout(initialRoute = "/") {
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
                <Route element={<DefaultLayout />}>
                  <Route path="/" element={<div>Home Page Content</div>} />
                  <Route
                    path="/groups"
                    element={<div>Groups Page Content</div>}
                  />
                  <Route
                    path="/setting"
                    element={<div>Settings Page Content</div>}
                  />
                  <Route
                    path="/admin"
                    element={<div>Admin Page Content</div>}
                  />
                </Route>
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  describe("Visibility", () => {
    it("should render the Navbar and the Outlet content", () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "user",
        Email: "user@example.com",
      });
      renderDefaultLayout();

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByText("Home Page Content")).toBeInTheDocument();
    });

    it("should show the Admin link for admin users", () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "admin",
        Email: "admin@example.com",
      });
      renderDefaultLayout();
      expect(screen.getByText(/navbar\.adminLink/i)).toBeInTheDocument();
    });

    it("should NOT show the Admin link for standard users", () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "user",
        Email: "user@example.com",
      });
      renderDefaultLayout();
      expect(screen.queryByText(/navbar\.adminLink/i)).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate correctly for an admin user to all links", async () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "admin",
        Email: "admin@example.com",
      });
      const user = userEvent.setup();
      renderDefaultLayout();

      // Test Groups Nav
      await user.click(screen.getByText(/navbar\.groupLink/i));
      expect(screen.getByText("Groups Page Content")).toBeInTheDocument();

      // Test Settings Nav
      await user.click(screen.getByText(/navbar\.settingLink/i));
      expect(screen.getByText("Settings Page Content")).toBeInTheDocument();

      // Test Admin Nav
      await user.click(screen.getByText(/navbar\.adminLink/i));
      expect(screen.getByText("Admin Page Content")).toBeInTheDocument();
    });

    it("should navigate correctly for a standard user and ensure Admin link is unreachable", async () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "user",
        Email: "user@example.com",
      });
      const user = userEvent.setup();
      renderDefaultLayout();

      // Test Groups Nav
      await user.click(screen.getByText(/navbar\.groupLink/i));
      expect(screen.getByText("Groups Page Content")).toBeInTheDocument();

      // Test Settings Nav
      await user.click(screen.getByText(/navbar\.settingLink/i));
      expect(screen.getByText("Settings Page Content")).toBeInTheDocument();

      // Verify Admin link is not there to be navigated to
      expect(screen.queryByText(/navbar\.adminLink/i)).not.toBeInTheDocument();
    });
  });
});
