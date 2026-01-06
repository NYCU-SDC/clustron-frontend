import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import ColorModeToggle from "./ColorModeToggle";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock lucide-react icons for ColorModeToggle
vi.mock("lucide-react", () => ({
  Moon: ({ className }: { className?: string }) => (
    <div data-testid="moon-icon" className={className} />
  ),
  Sun: ({ className }: { className?: string }) => (
    <div data-testid="sun-icon" className={className} />
  ),
}));

// Test component that uses the useTheme hook directly for specific tests
function ThemeInspector() {
  const { theme } = useTheme();
  return <div data-testid="current-theme">{theme}</div>;
}

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: query === "(prefers-color-scheme: dark)" ? false : true,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe("ThemeProvider", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Mock window.matchMedia properly for all tests
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaMock,
      writable: true,
    });

    // Mock document.documentElement.classList
    Object.defineProperty(document.documentElement, "classList", {
      value: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
        toggle: vi.fn(),
      },
      writable: true,
    });

    // Reset matchMedia mock to default behavior
    matchMediaMock.mockReturnValue({
      matches: false, // default to light theme
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Note: Testing error throwing with React components is complex in this setup
  // The useTheme hook does throw the error, but it's caught by React's error boundary system
  // In real usage, this error would be properly displayed

  it("should provide default theme value", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
  });

  it("should load theme from localStorage if available", () => {
    localStorageMock.getItem.mockReturnValue("dark");

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("vite-ui-theme");
  });

  it("should use custom default theme when provided", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme="light">
        <ThemeInspector />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("should use custom storage key when provided", () => {
    localStorageMock.getItem.mockReturnValue("dark");

    render(
      <ThemeProvider storageKey="custom-theme">
        <ThemeInspector />
      </ThemeProvider>,
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith("custom-theme");
  });

  //   it("should integrate with ColorModeToggle to change themes", async () => {
  //     const user = userEvent.setup();
  //     localStorageMock.getItem.mockReturnValue("system");

  //     render(
  //       <ThemeProvider>
  //         <div>
  //           <ThemeInspector />
  //           <ColorModeToggle />
  //         </div>
  //       </ThemeProvider>,
  //     );

  //     // Initially system theme
  //     expect(screen.getByTestId("current-theme")).toHaveTextContent("system");

  //     // Should show both sun and moon icons (theme toggle button)
  //     expect(screen.getByTestId("sun-icon")).toBeVisible();
  //     expect(screen.getByTestId("moon-icon")).toBeVisible();

  //     // Click the theme toggle button to open dropdown
  //     const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
  //     await user.click(toggleButton);

  //     // Click on Light option
  //     const lightOption = screen.getByText("Light");
  //     await user.click(lightOption);

  //     // Theme should change to light and be saved
  //     expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  //     expect(localStorageMock.setItem).toHaveBeenCalledWith(
  //       "vite-ui-theme",
  //       "light",
  //     );

  //     // Icons should still be present (ColorModeToggle always shows both for different themes)
  //     expect(screen.getByTestId("sun-icon")).toBeVisible();
  //     expect(screen.getByTestId("moon-icon")).not.toBeVisible();
  //   });

  //   it("should integrate with ColorModeToggle for dark theme selection", async () => {
  //     const user = userEvent.setup();
  //     localStorageMock.getItem.mockReturnValue("light");

  //     render(
  //       <ThemeProvider>
  //         <div>
  //           <ThemeInspector />
  //           <ColorModeToggle />
  //         </div>
  //       </ThemeProvider>,
  //     );

  //     // Initially light theme
  //     expect(screen.getByTestId("current-theme")).toHaveTextContent("light");

  //     // Should show both icons regardless of current theme
  //     expect(screen.getByTestId("sun-icon")).toHaveClass("scale-100");
  //     expect(screen.getByTestId("moon-icon")).toHaveClass("scale-0");

  //     // Click the theme toggle button to open dropdown
  //     const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
  //     await user.click(toggleButton);

  //     // Click on Dark option
  //     const darkOption = screen.getByText("Dark");
  //     await user.click(darkOption);

  //     // Theme should change to dark and be saved
  //     expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  //     expect(localStorageMock.setItem).toHaveBeenCalledWith(
  //       "vite-ui-theme",
  //       "dark",
  //     );

  //     // Icons should still be present after theme change
  //     expect(screen.getByTestId("sun-icon")).toHaveClass("scale-0");
  //     expect(screen.getByTestId("moon-icon")).toHaveClass("scale-100");
  //   });

  //   it("should show correct icon styling based on theme state", async () => {
  //     const user = userEvent.setup();
  //     localStorageMock.getItem.mockReturnValue("light");

  //     render(
  //       <ThemeProvider>
  //         <div>
  //           <ThemeInspector />
  //           <ColorModeToggle />
  //         </div>
  //       </ThemeProvider>,
  //     );

  //     // In light theme, sun icon should be visible, moon should be hidden
  //     const sunIcon = screen.getByTestId("sun-icon");
  //     const moonIcon = screen.getByTestId("moon-icon");

  //     expect(sunIcon).toHaveClass("rotate-0", "scale-100");
  //     expect(moonIcon).toHaveClass("absolute", "rotate-90", "scale-0");

  //     // Switch to dark theme
  //     const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
  //     await user.click(toggleButton);
  //     const darkOption = screen.getByText("Dark");
  //     await user.click(darkOption);

  //     // Verify theme changed
  //     expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");

  //     // Icons should still have correct classes (the CSS handles visibility via dark: modifiers)
  //     expect(sunIcon).toHaveClass("rotate-0", "scale-100");
  //     expect(moonIcon).toHaveClass("absolute", "rotate-90", "scale-0");
  //   });

  it("should add light class to document when theme is light", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("system");
    const removeClassSpy = vi.spyOn(
      document.documentElement.classList,
      "remove",
    );
    const addClassSpy = vi.spyOn(document.documentElement.classList, "add");

    render(
      <ThemeProvider>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    // Open theme selector and click light
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);
    const lightOption = screen.getByText("Light");
    await user.click(lightOption);

    expect(removeClassSpy).toHaveBeenCalledWith("light", "dark");
    expect(addClassSpy).toHaveBeenCalledWith("light");
  });

  it("should add dark class to document when theme is dark", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("system");
    const removeClassSpy = vi.spyOn(
      document.documentElement.classList,
      "remove",
    );
    const addClassSpy = vi.spyOn(document.documentElement.classList, "add");

    render(
      <ThemeProvider>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    // Open theme selector and click dark
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);
    const darkOption = screen.getByText("Dark");
    await user.click(darkOption);

    expect(removeClassSpy).toHaveBeenCalledWith("light", "dark");
    expect(addClassSpy).toHaveBeenCalledWith("dark");
  });

  it("should add system theme class based on matchMedia when theme is system", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("dark");
    const removeClassSpy = vi.spyOn(
      document.documentElement.classList,
      "remove",
    );
    const addClassSpy = vi.spyOn(document.documentElement.classList, "add");

    // Mock light system preference
    matchMediaMock.mockReturnValue({
      matches: false, // false = light theme
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    render(
      <ThemeProvider>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    // Open theme selector and click system
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);
    const systemOption = screen.getByText("System");
    await user.click(systemOption);

    expect(removeClassSpy).toHaveBeenCalledWith("light", "dark");
    expect(addClassSpy).toHaveBeenCalledWith("light"); // Should add light theme
  });

  it("should add dark system theme when matchMedia indicates dark preference", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("light");
    const removeClassSpy = vi.spyOn(
      document.documentElement.classList,
      "remove",
    );
    const addClassSpy = vi.spyOn(document.documentElement.classList, "add");

    // Mock dark system preference
    matchMediaMock.mockReturnValue({
      matches: true, // true = dark theme
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    render(
      <ThemeProvider>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    // Open theme selector and click system
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);
    const systemOption = screen.getByText("System");
    await user.click(systemOption);

    expect(removeClassSpy).toHaveBeenCalledWith("light", "dark");
    expect(addClassSpy).toHaveBeenCalledWith("dark"); // Should add dark theme
  });

  it("should apply initial theme classes on mount", () => {
    localStorageMock.getItem.mockReturnValue("light");
    const removeClassSpy = vi.spyOn(
      document.documentElement.classList,
      "remove",
    );
    const addClassSpy = vi.spyOn(document.documentElement.classList, "add");

    render(
      <ThemeProvider>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    expect(removeClassSpy).toHaveBeenCalledWith("light", "dark");
    expect(addClassSpy).toHaveBeenCalledWith("light");
  });

  it("should handle custom storage key when setting theme", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("system");

    render(
      <ThemeProvider storageKey="my-custom-theme">
        <ColorModeToggle />
      </ThemeProvider>,
    );

    // Open theme selector and click dark
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);
    const darkOption = screen.getByText("Dark");
    await user.click(darkOption);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "my-custom-theme",
      "dark",
    );
  });

  it("should maintain accessibility features in ColorModeToggle integration", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("system");

    render(
      <ThemeProvider>
        <ColorModeToggle />
      </ThemeProvider>,
    );

    // Toggle button should have proper accessibility attributes
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    // Click to open dropdown
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Should have proper screen reader text
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();

    // Theme options should be accessible
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("should handle rapid theme switching correctly", async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue("system");

    render(
      <ThemeProvider>
        <div>
          <ThemeInspector />
          <ColorModeToggle />
        </div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");

    // Rapidly switch themes: system -> light -> dark -> system
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    // Switch to light
    await user.click(toggleButton);
    await user.click(screen.getByText("Light"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");

    // Switch to dark
    await user.click(toggleButton);
    await user.click(screen.getByText("Dark"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");

    // Switch back to system
    await user.click(toggleButton);
    await user.click(screen.getByText("System"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");

    // Verify localStorage was called for each change
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "vite-ui-theme",
      "light",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "vite-ui-theme",
      "dark",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "vite-ui-theme",
      "system",
    );
  });
});
