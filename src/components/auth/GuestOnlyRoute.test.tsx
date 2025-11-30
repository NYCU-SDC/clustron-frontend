import { render, screen, waitFor } from "@testing-library/react";
import GuestOnlyRoute from "./GuestOnlyRoute";
import { AuthProvider } from "./AuthProvider";
import { MemoryRouter, Routes, Route } from "react-router";
import { useCookies, CookiesProvider } from "react-cookie";
import * as sonner from "sonner";
import { describe, it, afterEach, vi, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

describe("GuestOnlyRoute", () => {
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
                <Route element={<GuestOnlyRoute />}>
                  <Route index element={<TestOutlet />} />
                </Route>
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  it("renders Outlet when not logged in", async () => {
    renderWithProviders([{}, vi.fn(), vi.fn()]);
    await waitFor(() => {
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
      expect(sonner.toast.warning).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("redirects and shows toast when logged in", async () => {
    renderWithProviders([{ refreshToken: "mock-token" }, vi.fn(), vi.fn()]);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
      expect(sonner.toast.warning).toHaveBeenCalled();
      expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
    });
  });
});
