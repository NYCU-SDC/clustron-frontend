import { render, screen, waitFor, within } from "@testing-library/react";
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
import userEvent from "@testing-library/user-event";

// mock react-i18next so labels/placeholders are deterministic in tests
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "onboardingForm.labelForInputFullName": "Full name",
        "onboardingForm.labelForInputLinuxUsername": "Linux username",
        "onboardingForm.placeHolderForInputFullName": "Full name",
        "onboardingForm.labelForInputPassword": "Password",
        "onboardingForm.labelForInputConfirmPassword": "Confirm Password",
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

  async function fillRequiredFields(
    form: HTMLElement,
    fullName = "Alice",
    linuxUsername = "alice",
    password = "password123",
    confirmPassword = "password123",
  ) {
    const { getByLabelText } = within(form as HTMLElement);
    const fullNameInput = getByLabelText(/full name/i) as HTMLInputElement;
    const linuxInput = getByLabelText(/linux username/i) as HTMLInputElement;
    const passwordInput = getByLabelText(
      /^password\s*\*?$/i,
    ) as HTMLInputElement;
    const confirmPasswordInput = getByLabelText(
      /^confirm password\s*\*?$/i,
    ) as HTMLInputElement;

    // fill in valid values for all required fields
    const user = userEvent.setup();
    await user.type(fullNameInput, fullName);
    await user.type(linuxInput, linuxUsername);
    await user.type(passwordInput, password);
    await user.type(confirmPasswordInput, confirmPassword);

    // assert inputs contain the typed values
    expect(fullNameInput).toHaveValue(fullName);
    expect(linuxInput).toHaveValue(linuxUsername);
    expect(passwordInput).toHaveValue(password);
    expect(confirmPasswordInput).toHaveValue(confirmPassword);
  }

  it("shows validation error for invalid linux username format", async () => {
    renderForm();

    // locate the form
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    let saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();

    // fill out the form
    await fillRequiredFields(
      form,
      "Alice",
      "Invalid Linux Username!",
      "password123",
      "password123",
    );

    saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).not.toBeDisabled();

    const user = userEvent.setup();
    await user.click(saveBtn);

    await waitFor(() => {
      expect(saveOnboardingInfo).not.toHaveBeenCalled();
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });

  it("shows validation error when password and confirm password do not match", async () => {
    renderForm();

    // locate the form
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    let saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();

    // fill out the form with non-matching password and confirm password
    await fillRequiredFields(
      form,
      "Alice",
      "alice",
      "password123",
      "differentPassword",
    );

    saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).not.toBeDisabled();

    const user = userEvent.setup();
    await user.click(saveBtn);

    await waitFor(() => {
      expect(saveOnboardingInfo).not.toHaveBeenCalled();
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });

  it("shows validation error when password is shorter than 8 characters", async () => {
    renderForm();

    // locate the form
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    let saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();

    // fill out the form with a short password
    await fillRequiredFields(form, "Alice", "alice", "short", "short");

    saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).not.toBeDisabled();

    const user = userEvent.setup();
    await user.click(saveBtn);

    await waitFor(() => {
      expect(saveOnboardingInfo).not.toHaveBeenCalled();
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });

  it("shows validation error when password contains only letters", async () => {
    renderForm();

    // locate the form
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    let saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();

    // fill out the form
    await fillRequiredFields(form, "Alice", "alice", "password", "password");

    saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).not.toBeDisabled();

    const user = userEvent.setup();
    await user.click(saveBtn);

    await waitFor(() => {
      expect(saveOnboardingInfo).not.toHaveBeenCalled();
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });

  it("shows validation error when password contains only numbers", async () => {
    renderForm();

    // locate the form
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    let saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();

    // fill out the form
    await fillRequiredFields(form, "Alice", "alice", "12345678", "12345678");

    saveBtn = getByRole("button", { name: /save/i });
    expect(saveBtn).not.toBeDisabled();

    const user = userEvent.setup();
    await user.click(saveBtn);

    await waitFor(() => {
      expect(saveOnboardingInfo).not.toHaveBeenCalled();
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });

  it("submits successfully and shows success toast", async () => {
    vi.mocked(saveOnboardingInfo).mockResolvedValue(undefined);

    renderForm();

    // locate form
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    // fill out the form with valid values
    await fillRequiredFields(
      form,
      "Alice",
      "alice",
      "password123",
      "password123",
    );

    const user = userEvent.setup();
    await user.click(getByRole("button", { name: /save/i }));

    // button should go into loading and then show success toast
    await waitFor(() => {
      expect(saveOnboardingInfo).toHaveBeenCalledWith({
        fullName: "Alice",
        linuxUsername: "alice",
        password: "password123",
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

    // locate form and input fields
    const form = screen.getByRole("form", { name: /onboarding form/i });
    const { getByRole } = within(form as HTMLElement);

    // fill out the form with valid values (dummy values since the request will be mocked to fail)
    await fillRequiredFields(
      form,
      "Alice",
      "alice",
      "password123",
      "password123",
    );

    const user = userEvent.setup();
    await user.click(getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(sonner.toast.error).toHaveBeenCalled();
    });
  });
});
