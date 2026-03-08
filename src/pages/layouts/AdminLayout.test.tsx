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

// Mock react-cookie
vi.mock("react-cookie", async () => {
  const mod = await vi.importActual<typeof ReactCookie>("react-cookie");
  return {
    ...mod,
    useCookies: vi.fn(),
  };
});

// Mock jwt-decode
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

// Mock token getter
vi.mock("@/lib/token", () => ({
  getAccessToken: vi.fn(),
}));

// Mock logout
vi.mock("@/lib/request/logout", () => ({
  logout: vi.fn(),
}));

// Mock refreshAuthToken
vi.mock("@/lib/request/refreshAuthToken", () => ({
  refreshAuthToken: vi.fn(async () => ({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expirationTime: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

// Mock other APIs used in pages
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
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Default mock implementation for cookies
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
                    element={
                      <div data-testid="config-page">Role Config Page</div>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <div data-testid="users-page">User Config Page</div>
                    }
                  />
                </Route>
                <Route path="/" element={<div>Home Page</div>} />
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  it("should render admin sidebar and navigate correctly for admin users", async () => {
    vi.mocked(jwtDecode).mockReturnValue({ Role: "admin" });
    const user = userEvent.setup();

    renderAdminLayout();

    // Verify Title
    await waitFor(() => {
      expect(screen.getByText("adminSidebar.title")).toBeInTheDocument();
    });

    // Test Navigation to User Config
    const userLink = screen.getByText("adminSidebar.userConfigLink");
    await user.click(userLink);

    expect(screen.getByTestId("users-page")).toBeInTheDocument();

    // Test Navigation back to Role Config
    const roleLink = screen.getByText("adminSidebar.roleAccessConfigLink");
    await user.click(roleLink);

    expect(screen.getByTestId("config-page")).toBeInTheDocument();
  });

  it("should redirect non-admin users", async () => {
    vi.mocked(jwtDecode).mockReturnValue({ Role: "user" });

    renderAdminLayout();

    await waitFor(() => {
      // Should redirect to "/"
      expect(screen.getByText("Home Page")).toBeInTheDocument();
      expect(screen.queryByText("adminSidebar.title")).not.toBeInTheDocument();
    });
  });
});
