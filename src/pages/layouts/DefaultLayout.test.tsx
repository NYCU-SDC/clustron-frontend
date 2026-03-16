import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import DefaultLayout from "./DefaultLayout";
import App from "@/App";
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
vi.mock("@/lib/request/getGroups", () => ({
  getGroups: vi.fn(async () => []),
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
              <DefaultLayout />
              <App />
            </AuthProvider>
          </MemoryRouter>
        </CookiesProvider>
      </QueryClientProvider>,
    );
  }

  describe("Visibility", () => {
    it("should render the Navbar with correct links for a standard user", async () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "user",
        Email: "user@example.com",
      });
      renderDefaultLayout();

      const navbars = await screen.findAllByRole("navigation");
      const navbar = navbars[0];

      expect(navbar).toBeInTheDocument();

      const navLinks = Array.from(navbar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && !href.startsWith("#");
        },
      );

      // Standard user: Logo (to /groups), Groups, Settings
      expect(navLinks.length).toBe(3);

      navLinks.forEach((link) => {
        expect(link.getAttribute("href")).toBeTruthy();
        expect(link.textContent).toBeTruthy();
      });

      expect(screen.queryByText(/navbar\.adminLink/i)).not.toBeInTheDocument();
    });

    it("should render the Navbar with all links for an admin user", async () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "admin",
        Email: "admin@example.com",
      });
      renderDefaultLayout();

      const navbars = await screen.findAllByRole("navigation");
      const navbar = navbars[0];
      const navLinks = Array.from(navbar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && !href.startsWith("#");
        },
      );

      // Admin user: Logo (to /groups), Groups, Settings, Admin
      expect(navLinks.length).toBe(4);

      navLinks.forEach((link) => {
        expect(link.getAttribute("href")).toBeTruthy();
        expect(link.textContent).toBeTruthy();
      });

      expect(screen.getByText(/navbar\.adminLink/i)).toBeInTheDocument();
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

      const navbars = await screen.findAllByRole("navigation");
      const navbar = navbars[0];
      const navLinks = Array.from(navbar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && href !== "/" && !href.startsWith("#");
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

    it("should navigate correctly for a standard user and ensure Admin link is unreachable", async () => {
      vi.mocked(jwtDecode).mockReturnValue({
        Role: "user",
        Email: "user@example.com",
      });
      const user = userEvent.setup();
      renderDefaultLayout();

      const navbars = await screen.findAllByRole("navigation");
      const navbar = navbars[0];
      const navLinks = Array.from(navbar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && href !== "/" && !href.startsWith("#");
        },
      );

      for (const link of navLinks) {
        await user.click(link);
        await waitFor(() => {
          const notFoundText = screen.queryByText(/404 Not Found/i);
          expect(notFoundText).not.toBeInTheDocument();
        });
      }

      // Verify Admin link is not there to be navigated to
      expect(screen.queryByText(/navbar\.adminLink/i)).not.toBeInTheDocument();
    });
  });
});
