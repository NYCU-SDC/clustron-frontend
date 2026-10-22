// src/test/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

//mock localStorage in setup.ts because i18n calls getItem at import time in jsdom
const localStorageMock = {
  getItem: vi.fn().mockReturnValue(null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// 全域 mock i18n：保留其他 export（如 initReactI18next），只覆蓋 useTranslation/Trans
//
// `t` 和 `i18n` 必須是固定的 identity。真正的 useTranslation 會把 `t` 存在
// useState 裡（只有語言/namespace 變了才換），所以每次 render 都回傳新的
// function 會讓以 `t` 當 dependency 的 useMemo 全部失效——元件在測試裡會
// remount，但在瀏覽器裡不會。
const mockT = (key: string) => key; // 測試不關心翻譯文案，直接回 key
const mockI18n = { changeLanguage: () => Promise.resolve() };
const mockUseTranslation = () => ({ t: mockT, i18n: mockI18n });

vi.mock("react-i18next", async () => {
  const actual =
    await vi.importActual<typeof import("react-i18next")>("react-i18next");
  return {
    ...actual,
    useTranslation: mockUseTranslation,
    Trans: ({ children }: { children?: import("react").ReactNode }) => children,
  };
});

// Radix/shadcn 常見 polyfills（避免 jsdom 環境 crash）
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (q: string) => ({
    media: q,
    matches: false,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Ensure typing for the global ResizeObserver in the test environment
window.ResizeObserver = ResizeObserver;

// 避免 NaN
Element.prototype.getBoundingClientRect = function (): DOMRectReadOnly {
  const rect: Partial<DOMRectReadOnly> = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 20,
    right: 100,
    width: 100,
    height: 20,
    toJSON() {
      return {};
    },
  };
  return rect as DOMRectReadOnly;
};
