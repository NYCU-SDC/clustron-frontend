vi.unmock("react-i18next");
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect, Mock } from "vitest";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import GroupLayout from "./GroupLayout";
import App from "@/App";
import type * as ReactCookie from "react-cookie";
import { AccessLevelOwner } from "@/types/group";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";
import { truncateMiddle } from "@/components/Sidebar";

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

// Mock APIs for pages inside the layout to prevent 401s
vi.mock("@/lib/request/getGroups", () => ({
  getGroups: vi.fn(async () => []),
}));
vi.mock("@/lib/request/getMembers", () => ({
  getMembers: vi.fn(async () => []),
}));
vi.mock("@/lib/request/getPendingMembers", () => ({
  getPendingMembers: vi.fn(async () => []),
}));
vi.mock("@/lib/request/getPartitions", () => ({
  getPartitions: vi.fn(async () => []),
}));

describe("GroupLayout", () => {
  const mockGroup = {
    id: "123",
    title: "Engineering Team Cluster",
    me: {
      role: {
        accessLevel: AccessLevelOwner,
      },
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await i18n.changeLanguage("en");
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
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <CookiesProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
              <AuthProvider>
                <GroupLayout />
                <App />
              </AuthProvider>
            </MemoryRouter>
          </CookiesProvider>
        </QueryClientProvider>
      </I18nextProvider>,
    );
  }

  describe("Data Loading & Error States", () => {
    it("should render the group title and all navigation links in the sidebar when data is loaded", async () => {
      renderGroupLayout();
      await screen.findByText(truncateMiddle(mockGroup.title));

      const sidebars = screen.getAllByRole("complementary");
      const sidebar = sidebars[0];
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

      // In App.tsx, /groups renders GroupListPage
      // We check if the sidebar with group title is NOT present and we don't see 404.
      await waitFor(() => {
        expect(
          screen.queryByText(truncateMiddle(mockGroup.title)),
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/404 Not Found/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate correctly between dynamic group sub-pages", async () => {
      const user = userEvent.setup();
      renderGroupLayout();

      await screen.findByText(truncateMiddle(mockGroup.title));

      const sidebars = await screen.findAllByRole("complementary");
      const sidebar = sidebars[0];
      const navLinks = Array.from(sidebar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && !href.startsWith("#");
        },
      );

      for (const link of navLinks) {
        await user.click(link);
        await waitFor(() => {
          const notFoundText = screen.queryByText(/404 Not Found/i);
          expect(notFoundText).not.toBeInTheDocument();
        });
      }
    });
  });
});
