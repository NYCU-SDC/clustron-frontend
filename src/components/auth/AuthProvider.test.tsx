import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./AuthProvider";
import LoginForm from "@/components/LoginForm";
import { MemoryRouter } from "react-router";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// mock sonner to avoid real toast side effects
vi.mock("sonner", () => ({
  toast: { info: vi.fn(), warning: vi.fn() },
}));

// mock logout/refreshAuthToken to avoid real network calls during AuthProvider setup
vi.mock("@/lib/request/logout", () => ({
  logout: vi.fn(),
}));

vi.mock("@/lib/request/refreshAuthToken", () => ({
  refreshAuthToken: vi.fn(async () => ({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expirationTime: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

// mock image imports referenced by LoginMethodIcon
vi.mock("@/assets/NYCU_Light.png", () => ({
  default: "nycu-light.png",
}));

vi.mock("@/assets/NYCU_Dark.png", () => ({
  default: "nycu-dark.png",
}));

function renderLoginForm() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </MemoryRouter>
      </CookiesProvider>
    </QueryClientProvider>,
  );
}

describe("AuthProvider login redirection", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: {
        protocol: "https:",
        host: "app.example.com",
        href: "",
      },
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("redirects to the configured backend base URL when VITE_BACKEND_BASE_URL is set", async () => {
    vi.stubEnv("VITE_BACKEND_BASE_URL", "https://api.example.com");
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByText("login.googleLoginBtn"));

    expect(window.location.href).toBe(
      "https://api.example.com/api/login/oauth/google?c=https://app.example.com/callback/login&r=https://app.example.com/",
    );
  });

  it("falls back to a relative OAuth path without literal 'undefined' when VITE_BACKEND_BASE_URL is unset (container/reverse-proxy env)", async () => {
    vi.stubEnv("VITE_BACKEND_BASE_URL", undefined);
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByText("login.nycuLoginBtn"));

    expect(window.location.href).toBe(
      "/api/login/oauth/nycu?c=https://app.example.com/callback/login&r=https://app.example.com/",
    );
    expect(window.location.href).not.toContain("undefined");
  });
});
