import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import Navbar from "./Navbar";
import App from "@/App";
import { authContext } from "@/lib/auth/authContext";
import type { AuthContextType } from "@/lib/auth/authContext";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AuthCookie } from "@/types/type";

// Mock jwt-decode to return admin role token
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({
    Email: "admin@test.com",
    Role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

// Mock getAccessToken to return a dummy token
vi.mock("@/lib/token", () => ({
  getAccessToken: vi.fn(() => "mock-access-token"),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "navbar.groupLink": "Groups",
        "navbar.jobsLink": "Jobs",
        "navbar.settingLink": "Settings",
        "navbar.adminLink": "Admin",
        "navbar.logoutBtn": "Logout",
      };
      return translations[key] || key;
    },
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock logout to avoid side effects
vi.mock("@/lib/request/logout", () => ({
  logout: vi.fn(),
}));

// Mock refreshAuthToken used in AuthProvider
vi.mock("@/lib/request/refreshAuthToken", () => ({
  refreshAuthToken: vi.fn(async () => ({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expirationTime: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithRouter() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const mockRefreshMutation = {
      mutateAsync: vi.fn(
        async () =>
          ({
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            expirationTime: Math.floor(Date.now() / 1000) + 3600,
          }) as AuthCookie,
      ),
      isPending: false,
      mutate: vi.fn(),
      reset: vi.fn(),
    } as unknown as UseMutationResult<AuthCookie, Error, void, unknown>;

    const mockAuthContextValue: AuthContextType = {
      login: vi.fn(),
      setCookiesForAuthToken: vi.fn(),
      handleLogout: vi.fn(),
      isLoggedIn: () => true,
      refreshMutation: mockRefreshMutation,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <CookiesProvider>
            <authContext.Provider value={mockAuthContextValue}>
              <Navbar />
              <App />
            </authContext.Provider>
          </CookiesProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  }

  it("should navigate to a valid page when a navbar link is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    // Find the first navbar element (there are multiple due to rendering both Navbar and App)
    const navbars = screen.getAllByRole("navigation");
    const navbar = navbars[0]; // Get the first one which is the actual Navbar component

    // Find all <a> tags within the navbar
    const navLinks = navbar.querySelectorAll("a");

    // Filter for actual navigation links (exclude home "/" and hash links)
    const navigationLinks = Array.from(navLinks).filter((link) => {
      const href = link.getAttribute("href");
      return href && href !== "/" && !href.startsWith("#");
    });

    // Verify we found some links
    expect(navigationLinks.length).toBeGreaterThan(0);

    // Test each link
    for (const link of navigationLinks) {
      const href = link.getAttribute("href");
      const linkText = link.textContent;

      // Click the link
      await user.click(link);

      // Wait for navigation and verify we didn't hit the 404 page
      await waitFor(() => {
        const notFoundText = screen.queryByText(/404 Not Found/i);
        expect(notFoundText).not.toBeInTheDocument();
      });

      console.log(`✓ Link "${linkText}" (${href}) navigates to a valid route`);
    }
  });

  it("should render navigation links for admin role", () => {
    renderWithRouter();

    // Find the first navbar element (there are multiple due to rendering both Navbar and App)
    const navbars = screen.getAllByRole("navigation");
    const navbar = navbars[0]; // Get the first one which is the actual Navbar component

    // Find all <a> tags within the navbar (excluding home "/")
    const navLinks = Array.from(navbar.querySelectorAll("a")).filter((link) => {
      const href = link.getAttribute("href");
      return href && href !== "/" && !href.startsWith("#");
    });

    // Verify we have the expected number of navigation links for admin (Groups, Jobs, Settings, Admin)
    expect(navLinks.length).toBe(4);

    // Verify each link has valid href
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(link.textContent).toBeTruthy();
    });
  });
});
