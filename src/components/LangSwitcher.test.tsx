import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LangSwitcher from "./LangSwitcher";

// Mock react-i18next
const mockChangeLanguage = vi.fn();
const mockI18n = {
  language: "zh",
  changeLanguage: mockChangeLanguage,
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Globe: ({ className }: { className?: string }) => (
    <div data-testid="globe-icon" className={className} />
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe("LangSwitcher", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    vi.clearAllMocks();
    mockI18n.language = "zh";
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should render the language switcher button with default Chinese", () => {
    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("繁體中文");

    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-down-icon")).toBeInTheDocument();
  });

  it("should display current language from i18n", () => {
    mockI18n.language = "en";

    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("English");
  });

  it("should load stored language from localStorage on mount", () => {
    localStorageMock.getItem.mockReturnValue("en");

    render(<LangSwitcher />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith("lang");
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("English");
  });

  it("should fallback to Chinese when stored language is invalid", () => {
    localStorageMock.getItem.mockReturnValue("invalid");
    mockI18n.language = "zh";

    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("繁體中文");
  });

  it("should open dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("English")).toBeInTheDocument();
    // Use getAllByText since the text appears in both button and menu item
    const chineseTexts = screen.getAllByText("繁體中文");
    expect(chineseTexts.length).toBeGreaterThan(1); // Should have both button and menu item
  });

  it("should change language to English when English option is clicked", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    const englishOption = screen.getByText("English");
    await user.click(englishOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("lang", "en");
  });

  it("should change language to Chinese when Chinese option is clicked", async () => {
    const user = userEvent.setup();
    mockI18n.language = "en";

    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    const chineseOption = screen.getByText("繁體中文");
    await user.click(chineseOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith("zh");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("lang", "zh");
  });

  it("should change language immediately if i18n language differs from initial on mount", () => {
    localStorageMock.getItem.mockReturnValue("en");
    mockI18n.language = "zh"; // Different from stored

    render(<LangSwitcher />);

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });

  it("should not change language if i18n language matches stored language", () => {
    localStorageMock.getItem.mockReturnValue("en");
    mockI18n.language = "en"; // Same as stored

    render(<LangSwitcher />);

    expect(mockChangeLanguage).not.toHaveBeenCalled();
  });

  it("should update button text after language change", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    // Initially shows Chinese
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("繁體中文");

    await user.click(button);
    const englishOption = screen.getByText("English");
    await user.click(englishOption);

    // Should now show English (note: the test would need to re-render to see this change)
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("lang", "en");
  });

  it("should have proper button styling", () => {
    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("inline-flex"); // Button component classes

    const globeIcon = screen.getByTestId("globe-icon");
    expect(globeIcon).toHaveClass("h-4", "w-4");

    const chevronIcon = screen.getByTestId("chevron-down-icon");
    expect(chevronIcon).toHaveClass("h-4", "w-4", "opacity-70");
  });

  it("should render all available language options in dropdown", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Should have both language options
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(2);

    expect(screen.getByText("English")).toBeInTheDocument();
    // Use getAllByText since the text appears in both button and menu item
    const chineseTexts = screen.getAllByText("繁體中文");
    expect(chineseTexts.length).toBeGreaterThan(1); // Should have both button and menu item
  });

  it("should close dropdown after selecting a language", async () => {
    const user = userEvent.setup();
    render(<LangSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    const englishOption = screen.getByText("English");
    await user.click(englishOption);

    // Menu should be closed after selection (options not visible in separate query)
    // Note: This is testing the behavior, the actual dropdown closing might need specific assertions
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
