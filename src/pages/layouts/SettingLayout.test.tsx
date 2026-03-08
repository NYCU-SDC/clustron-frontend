import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SettingLayout from "./SettingLayout";

// 1. Setup Mocks
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

describe("SettingLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderSettingLayout(initialRoute = "/setting/general") {
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
                <Route path="/setting" element={<SettingLayout />}>
                  <Route
                    path="general"
                    element={<div>General Settings Content</div>}
                  />
                  <Route path="ssh" element={<div>SSH Keys Content</div>} />
                </Route>
              </Routes>
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  describe("Visibility", () => {
    it("should render the setting sidebar for a logged-in user", async () => {
      renderSettingLayout();
      // Using findBy instead of waitFor for cleaner syntax
      const title = await screen.findByText("settingSideBar.title");
      expect(title).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate correctly between sub-pages", async () => {
      const user = userEvent.setup();
      renderSettingLayout();

      // Ensure layout is ready
      await screen.findByText("settingSideBar.title");

      // 1. Click SSH Keys Link
      const sshLink = screen.getByText("settingSideBar.SSHNavLink");
      await user.click(sshLink);
      expect(screen.getByText("SSH Keys Content")).toBeInTheDocument();

      // 2. Click General Link
      const generalLink = screen.getByText("settingSideBar.GeneralNavLink");
      await user.click(generalLink);
      expect(screen.getByText("General Settings Content")).toBeInTheDocument();
    });
  });
});
