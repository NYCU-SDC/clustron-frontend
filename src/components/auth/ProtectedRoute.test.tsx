import { render, screen, waitFor } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthProvider";
import { MemoryRouter, Routes, Route } from "react-router";
import { useCookies, CookiesProvider } from "react-cookie";
import * as sonner from "sonner";
import { describe, it, afterEach, vi, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";

// mock react-cookie to control cookie state in tests to test the logged-in and logged-out scenarios
vi.mock("react-cookie", async () => {
  const mod = await vi.importActual("react-cookie");
  return {
    ...mod,
    useCookies: vi.fn(),
    Cookies: vi.fn(), // mock Cookies export
  };
});

// mock sonner to track toast calls
vi.mock("sonner", () => ({
  toast: { warning: vi.fn() },
}));

// mock react-router to track navigation calls
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

// mock logout to avoid side effects during tests
vi.mock("@/lib/request/logout", () => ({
  logout: vi.fn(),
}));

// mock refreshAuthToken to avoid real network calls during AuthProvider auto-refresh
vi.mock("@/lib/request/refreshAuthToken", () => ({
  refreshAuthToken: vi.fn(async () => ({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expirationTime: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

// mock token getter and jwtDecode so we can control Role and token presence
vi.mock("@/lib/token", () => ({
  getAccessToken: vi.fn(),
}));

vi.mock("jwt-decode", async () => {
  return { jwtDecode: vi.fn() };
});

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  function TestOutlet() {
    return <div data-testid="outlet">Outlet Content</div>;
  }

  function renderWithProviders(
    cookieMock: [Record<string, string>, () => void, () => void],
  ) {
    (useCookies as ReturnType<typeof vi.fn>).mockReturnValue(cookieMock);
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <MemoryRouter initialEntries={["/"]}>
            <AuthProvider>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route index element={<TestOutlet />} />
                </Route>
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  it("renders Outlet when logged in and role is set", async () => {
    // cookies indicate logged in
    renderWithProviders([{ refreshToken: "mock-refresh" }, vi.fn(), vi.fn()]);

    // token exists and role is 'admin'
    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue("mock-token");
    (jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({ Role: "admin" });

    await waitFor(() => {
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
      expect(sonner.toast.warning).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("redirects to /login and shows toast when not logged in", async () => {
    renderWithProviders([{}, vi.fn(), vi.fn()]);

    // no token
    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(null);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(sonner.toast.warning).toHaveBeenCalled();
      expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
    });
  });

  it("redirects to /onboarding and shows toast when role is not set up", async () => {
    renderWithProviders([{ refreshToken: "mock-refresh" }, vi.fn(), vi.fn()]);

    (getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue("mock-token");
    (jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
      Role: "role_not_setup",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/onboarding");
      expect(sonner.toast.warning).toHaveBeenCalled();
      expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
    });
  });
});
