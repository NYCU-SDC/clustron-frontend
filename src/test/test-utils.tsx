import { ReactNode } from "react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export function render(ui: ReactNode, { route = "/" } = {}) {
  return rtlRender(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
export * from "@testing-library/react";
