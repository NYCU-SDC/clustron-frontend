import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import OnboardingForm from "./OnboardingForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as sonner from "sonner";
import { CookiesProvider } from "react-cookie";
import { describe, it, vi, afterEach, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { saveOnboardingInfo } from "@/lib/request/saveOnboardingInfo";
import { authContext, AuthContextType } from "@/lib/auth/authContext";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AuthCookie } from "@/types/settings";

// mock react-i18next so labels/placeholders are deterministic in tests
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "onboardingForm.labelForInputFullName": "Full name",
        "onboardingForm.labelForInputLinuxUsername": "Linux username",
        "onboardingForm.placeHolderForInputFullName": "Full name",
        "onboardingForm.saveBtn": "Save",
        "onboardingForm.saveBtnToolTip": "Fill required fields",
        "onboardingForm.loadingBtn": "Loading",
      };
      return map[key] ?? key;
    },
  }),
}));

// mock sonner to inspect toasts
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// mock saveOnboardingInfo to control backend responses
vi.mock("@/lib/request/saveOnboardingInfo", () => ({
  saveOnboardingInfo: vi.fn(),
}));

// mock refreshAuthToken used in AuthProvider called by the form
vi.mock("@/lib/request/refreshAuthToken", () => ({
  refreshAuthToken: vi.fn(async () => ({
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expirationTime: Math.floor(Date.now() / 1000) + 3600,
  })),
}));

describe("OnboardingForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderForm() {
    const queryClient = new QueryClient();
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
              <Routes>
                <Route path="/" element={<OnboardingForm />} />
              </Routes>
            </authContext.Provider>
          </CookiesProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  }

  it("shows validation error for invalid linux username format", async () => {
    renderForm();

    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByLabelText, getByRole } = within(form as HTMLElement);
    const fullNameInput = getByLabelText(/full name/i) as HTMLInputElement;
    const linuxInput = getByLabelText(/linux username/i) as HTMLInputElement;
    let saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();

    fireEvent.change(fullNameInput, { target: { value: "Alice" } });
    fireEvent.change(linuxInput, { target: { value: "Invalid Username!" } });

    // assert inputs contain the typed values
    expect(fullNameInput).toHaveValue("Alice");
    expect(linuxInput).toHaveValue("Invalid Username!");

    saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).not.toBeDisabled();
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(saveOnboardingInfo).not.toHaveBeenCalled();
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });

  it("submits successfully and shows success toast", async () => {
    vi.mocked(saveOnboardingInfo).mockResolvedValue(undefined);

    renderForm();

    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByLabelText, getByRole } = within(form as HTMLElement);
    const fullNameInput = getByLabelText(/full name/i) as HTMLInputElement;
    const linuxInput = getByLabelText(/linux username/i) as HTMLInputElement;

    fireEvent.change(fullNameInput, { target: { value: "Alice" } });
    fireEvent.change(linuxInput, { target: { value: "alice" } });
    const saveBtn = getByRole("button", { name: /save/i });
    // assert inputs contain the typed values
    expect(fullNameInput).toHaveValue("Alice");
    expect(linuxInput).toHaveValue("alice");
    fireEvent.click(saveBtn);

    // button should go into loading and then show success toast
    await waitFor(() => {
      expect(saveOnboardingInfo).toHaveBeenCalledWith({
        fullName: "Alice",
        linuxUsername: "alice",
      });
      expect(sonner.toast.error).not.toHaveBeenCalled();
      expect(sonner.toast.success).toHaveBeenCalled();
    });
  });

  it.each([
    ["exists", "onboardingForm.usernameExistsErrorToast"],
    ["reserved", "onboardingForm.reservedKeywordErrorToast"],
    ["start", "onboardingForm.formatErrorToast"],
    ["other", "onboardingForm.saveFailToast"],
  ])("handles backend error with message containing '%s'", async (marker) => {
    const { saveOnboardingInfo } = await vi.importMock<
      typeof import("@/lib/request/saveOnboardingInfo")
    >("@/lib/request/saveOnboardingInfo");

    const err = new Error(marker);
    err.name = "400";
    (saveOnboardingInfo as ReturnType<typeof vi.fn>).mockRejectedValue(err);

    renderForm();

    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByLabelText, getByRole } = within(form as HTMLElement);
    const fullNameInput = getByLabelText(/full name/i) as HTMLInputElement;
    const linuxInput = getByLabelText(/linux username/i) as HTMLInputElement;

    fireEvent.change(fullNameInput, { target: { value: "Alice" } });
    fireEvent.change(linuxInput, { target: { value: "alice" } });
    const saveBtn = getByRole("button", { name: /save/i });
    // assert inputs contain the typed values
    expect(fullNameInput).toHaveValue("Alice");
    expect(linuxInput).toHaveValue("alice");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });
});
