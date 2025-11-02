import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

// Mock the auth context
const mockLogin = vi.fn();
vi.mock("@/lib/auth/authContext", () => ({
  authContext: {
    Consumer: ({
      children,
    }: {
      children: (value: { login: typeof mockLogin }) => React.ReactNode;
    }) => children({ login: mockLogin }),
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock react-i18next
const mockT = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock image imports
vi.mock("@/assets/NYCU_Light.png", () => ({
  default: "nycu-light.png",
}));

vi.mock("@/assets/NYCU_Dark.png", () => ({
  default: "nycu-dark.png",
}));

// Mock useContext
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useContext: () => ({ login: mockLogin }),
  };
});

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup translation mocks
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        "login.loginTitle": "Login",
        "login.nycuLoginNote": "Use your NYCU account",
        "login.nycuLoginBtn": "Continue with NYCU",
        "login.googleLoginNote": "Or use your Google account",
        "login.googleLoginBtn": "Continue with Google",
      };
      return translations[key] || key;
    });
  });

  it("should render the login form with title", () => {
    render(<LoginForm />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith("login.loginTitle");
  });

  it("should render NYCU login section", () => {
    render(<LoginForm />);

    expect(screen.getByText("Use your NYCU account")).toBeInTheDocument();
    expect(screen.getByText("Continue with NYCU")).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith("login.nycuLoginNote");
    expect(mockT).toHaveBeenCalledWith("login.nycuLoginBtn");
  });

  it("should render Google login section", () => {
    render(<LoginForm />);

    expect(screen.getByText("Or use your Google account")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith("login.googleLoginNote");
    expect(mockT).toHaveBeenCalledWith("login.googleLoginBtn");
  });

  it("should display NYCU images with proper dark/light mode classes", () => {
    render(<LoginForm />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);

    // Light mode image
    const lightImg = images[0];
    expect(lightImg).toHaveAttribute("src", "nycu-light.png");
    expect(lightImg).toHaveClass("block", "dark:hidden");

    // Dark mode image
    const darkImg = images[1];
    expect(darkImg).toHaveAttribute("src", "nycu-dark.png");
    expect(darkImg).toHaveClass("hidden", "dark:block");
  });

  it("should call login with 'nycu' when NYCU button is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const nycuButton = screen.getByText("Continue with NYCU");
    await user.click(nycuButton);

    expect(mockLogin).toHaveBeenCalledWith("nycu");
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it("should call login with 'google' when Google button is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const googleButton = screen.getByText("Continue with Google");
    await user.click(googleButton);

    expect(mockLogin).toHaveBeenCalledWith("google");
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it("should render Google SVG icon", () => {
    render(<LoginForm />);

    const googleButton = screen.getByText("Continue with Google");
    const svgIcon = googleButton.querySelector("svg");

    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svgIcon?.querySelector("path")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  });

  it("should have proper button styling", () => {
    render(<LoginForm />);

    const nycuButton = screen.getByText("Continue with NYCU");
    const googleButton = screen.getByText("Continue with Google");

    expect(nycuButton).toHaveClass("w-full", "p-6", "cursor-pointer");
    expect(googleButton).toHaveClass("w-full", "p-6", "cursor-pointer");
  });

  it("should accept custom className and props", () => {
    render(<LoginForm className="custom-class" data-testid="login-form" />);

    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toHaveClass("custom-class");
  });

  it("should render within a card component", () => {
    render(<LoginForm />);

    // Check for card structure
    const title = screen.getByText("Login");
    expect(title.closest('[class*="card"]')).toBeInTheDocument();
  });

  it("should have both login buttons enabled by default", () => {
    render(<LoginForm />);

    const nycuButton = screen.getByText("Continue with NYCU");
    const googleButton = screen.getByText("Continue with Google");

    expect(nycuButton).not.toBeDisabled();
    expect(googleButton).not.toBeDisabled();
  });

  it("should call different login methods independently", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const nycuButton = screen.getByText("Continue with NYCU");
    const googleButton = screen.getByText("Continue with Google");

    await user.click(nycuButton);
    expect(mockLogin).toHaveBeenCalledWith("nycu");

    await user.click(googleButton);
    expect(mockLogin).toHaveBeenCalledWith("google");

    expect(mockLogin).toHaveBeenCalledTimes(2);
  });

  it("should have proper semantic structure", () => {
    render(<LoginForm />);

    // Should have the title text (even if not a semantic heading)
    const title = screen.getByText("Login");
    expect(title).toBeInTheDocument();

    // Should have two buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    // Buttons should have descriptive text
    expect(buttons[0]).toHaveTextContent("Continue with NYCU");
    expect(buttons[1]).toHaveTextContent("Continue with Google");
  });
});
