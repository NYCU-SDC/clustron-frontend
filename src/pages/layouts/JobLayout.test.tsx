import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies, CookiesProvider } from "react-cookie";
import { getAccessToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/components/auth/AuthProvider";
import JobLayout from "./JobLayout";
import type * as ReactCookie from "react-cookie";

// 1. Setup Global Mocks
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

describe("JobLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderJobLayout(initialRoute = "/jobs") {
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
    vi.mocked(jwtDecode).mockReturnValue({
      Role: "user",
      Email: "user@example.com",
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <AuthProvider>
              <Routes>
                <Route element={<JobLayout />}>
                  <Route path="/jobs" element={<div>Job List Content</div>} />
                  <Route
                    path="/jobs/submit"
                    element={<div>Submit Job Content</div>}
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
    it("should render the job sidebar title and all navigation links", async () => {
      renderJobLayout();

      // Check Title
      await screen.findByText("jobsSideBar.title");

      const sidebar = screen.getByRole("complementary");
      const navLinks = Array.from(sidebar.querySelectorAll("a")).filter(
        (link) => {
          const href = link.getAttribute("href");
          return href && !href.startsWith("#");
        },
      );

      // Verify count: Job List, Submit Job
      expect(navLinks.length).toBe(2);

      navLinks.forEach((link) => {
        expect(link.getAttribute("href")).toBeTruthy();
        expect(link.textContent).toBeTruthy();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate correctly between job list and job submission sub-pages", async () => {
      const user = userEvent.setup();
      renderJobLayout();

      // Ensure layout is ready
      await screen.findByText("jobsSideBar.title");

      // 1. Click Submit Job Link
      const submitLink = screen.getByText("jobsSideBar.SubmitNavLink");
      await user.click(submitLink);
      expect(screen.getByText("Submit Job Content")).toBeInTheDocument();

      // 2. Click Job List Link
      const listLink = screen.getByText("jobsSideBar.ListNavLink");
      await user.click(listLink);
      expect(screen.getByText("Job List Content")).toBeInTheDocument();
    });
  });
});
