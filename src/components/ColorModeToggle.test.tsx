import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorModeToggle from "./ColorModeToggle";

// Mock the ThemeProvider
const mockSetTheme = vi.fn();
vi.mock("@/components/ThemeProvider", () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Moon: ({ className }: { className?: string }) => (
    <div data-testid="moon-icon" className={className} />
  ),
  Sun: ({ className }: { className?: string }) => (
    <div data-testid="sun-icon" className={className} />
  ),
}));

describe("ColorModeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("should render the toggle button with icons", () => {
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();

    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should open dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("should call setTheme with 'light' when Light option is clicked", async () => {
    const user = userEvent.setup();
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);

    const lightOption = screen.getByText("Light");
    await user.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("should call setTheme with 'dark' when Dark option is clicked", async () => {
    const user = userEvent.setup();
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);

    const darkOption = screen.getByText("Dark");
    await user.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("should call setTheme with 'system' when System option is clicked", async () => {
    const user = userEvent.setup();
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);

    const systemOption = screen.getByText("System");
    await user.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith("system");
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("should have proper button styling classes", () => {
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveClass("inline-flex"); // Button component classes

    const sunIcon = screen.getByTestId("sun-icon");
    expect(sunIcon).toHaveClass(
      "h-[1.2rem]",
      "w-[1.2rem]",
      "rotate-0",
      "scale-100",
    );

    const moonIcon = screen.getByTestId("moon-icon");
    expect(moonIcon).toHaveClass(
      "absolute",
      "h-[1.2rem]",
      "w-[1.2rem]",
      "rotate-90",
      "scale-0",
    );
  });

  it("should close dropdown after selecting an option", async () => {
    const user = userEvent.setup();
    render(<ColorModeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);

    const lightOption = screen.getByText("Light");
    await user.click(lightOption);

    // Menu should be closed after selection
    expect(screen.queryByText("Light")).not.toBeInTheDocument();
  });
});
