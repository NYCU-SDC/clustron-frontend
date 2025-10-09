// src/test/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// 全域 mock i18n：保留其他 export（如 initReactI18next），只覆蓋 useTranslation/Trans
vi.mock("react-i18next", async () => {
  const actual =
    await vi.importActual<typeof import("react-i18next")>("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key, // 測試不關心翻譯文案，直接回 key
      i18n: { changeLanguage: () => Promise.resolve() },
    }),
    Trans: ({ children }: { children?: import("react").ReactNode }) => children,
  };
});

// Radix/shadcn 常見 polyfills（避免 jsdom 環境崩）
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
