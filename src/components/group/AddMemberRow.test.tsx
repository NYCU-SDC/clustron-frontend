import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddMemberRow from "./AddMemberRow";
import { ComponentProps } from "react";

// [MOCK] 把 shadcn 的 Input/Button/Select 簡化成原生元素（避免 Radix 複雜度）
vi.mock("@/components/ui/input", () => ({
  Input: (p: ComponentProps<"input">) => <input {...p} />,
})); // [VITEST MOCK]
vi.mock("@/components/ui/button", () => ({
  Button: (p: ComponentProps<"button">) => <button {...p} />,
})); // [VITEST MOCK]
vi.mock("@/components/ui/select", () => ({
  // [VITEST MOCK]
  Select: ({
    value,
    disabled,
    onValueChange,
    children,
  }: ComponentProps<"select"> & {
    onValueChange?: (v: string) => void;
    children?: import("react").ReactNode;
  }) => (
    <select
      aria-label="role-select"
      value={value}
      disabled={disabled}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children?: import("react").ReactNode }) => (
    <>{children}</>
  ),
  SelectValue: ({ children }: { children?: import("react").ReactNode }) => (
    <>{children}</>
  ),
  SelectContent: ({ children }: { children?: import("react").ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value?: string;
    children?: import("react").ReactNode;
  }) => <option value={value}>{children}</option>,
}));

// [MOCK] 把 hook 改成回傳固定的角色清單
vi.mock("@/hooks/useRoleMapper", () => ({
  // [VITEST MOCK]
  useRoleMapper: () => ({
    getRolesByAccessLevel: () => [
      { id: "RID_STUDENT", roleName: "student" },
      { id: "RID_TA", roleName: "ta" },
    ],
  }),
}));

// [MOCK] Mock the useUserAutocomplete hook to avoid QueryClient requirement
vi.mock("@/hooks/useUserAutocomplete", () => ({
  useUserAutocomplete: () => ({
    data: { pages: [] },
    isLoading: false,
    isError: false,
    error: null,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isFetchingNextPage: false,
  }),
}));

describe("AddMemberRow", () => {
  const setup = (
    override: Partial<ComponentProps<typeof AddMemberRow>> = {},
  ) => {
    // [VITEST] 建立 spy 函式，之後用 expect 驗證被呼叫
    const onChange = vi.fn(); // [VITEST]
    const onAdd = vi.fn(); // [VITEST]
    const onRemove = vi.fn(); // [VITEST]
    const onAddBatch = vi.fn(); // [VITEST]

    const props: React.ComponentProps<typeof AddMemberRow> = {
      index: 0,
      id: "",
      roleName: "student",
      isLast: true,
      onChange,
      onAdd,
      onRemove,
      onAddBatch,
      isDuplicate: false,
      disabled: false,
      isPending: false,
    };

    // [RTL] 把元件渲染進 jsdom
    render(
      <table>
        <tbody>
          <AddMemberRow {...props} {...override} />
        </tbody>
      </table>,
    );

    // [RTL] 用可存取 API 查找元素
    const row = screen.getByRole("row");
    return { row, onChange, onAdd, onRemove, onAddBatch };
  };

  it('選擇角色會呼叫 onChange(index,"roleName",value)', async () => {
    // [RTL] 建立使用者互動
    const user = userEvent.setup();
    const { row, onChange } = setup({ roleName: "student" });
    // [RTL] 查找 select 並互動
    const select = within(row).getByLabelText(
      "role-select",
    ) as HTMLSelectElement;
    await user.selectOptions(select, "ta"); // [RTL]
    // [VITEST] 斷言 mock 函式被正確呼叫
    expect(onChange).toHaveBeenCalledWith(0, "roleName", "ta"); // [VITEST]
  });

  it("isLast=true 顯示加號按鈕；點擊呼叫 onAdd", async () => {
    const user = userEvent.setup(); // [RTL]
    const { row, onAdd } = setup({ isLast: true });
    const buttons = within(row).getAllByRole("button"); // [RTL]
    await user.click(buttons[buttons.length - 1]); // [RTL]
    expect(onAdd).toHaveBeenCalled(); // [VITEST]
  });

  it("isLast=false 顯示減號按鈕；點擊呼叫 onRemove(index)", async () => {
    const user = userEvent.setup(); // [RTL]
    const { row, onRemove } = setup({ isLast: false });
    const buttons = within(row).getAllByRole("button"); // [RTL]
    await user.click(buttons[buttons.length - 1]); // [RTL]
    expect(onRemove).toHaveBeenCalledWith(0); // [VITEST]
  });

  it("disabled / isPending 會讓輸入/選擇/按鈕不可用", () => {
    const { row } = setup({ disabled: true, isPending: true });
    expect(
      within(row).getByPlaceholderText(
        "groupComponents.addMemberRow.enterStudentIdOrEmail",
      ),
    ).toBeDisabled(); // [RTL 斷言]
    expect(within(row).getByLabelText("role-select")).toBeDisabled(); // [RTL 斷言]
    const buttons = within(row).getAllByRole("button"); // [RTL]
    expect(buttons[buttons.length - 1]).toBeDisabled(); // [RTL 斷言]
  });

  it("isDuplicate 會加上 title（提示重複）", () => {
    const { row } = setup({ isDuplicate: true });
    const input = within(row).getByPlaceholderText(
      "groupComponents.addMemberRow.enterStudentIdOrEmail",
    ); // [RTL]
    expect(input).toHaveAttribute(
      "title",
      "groupComponents.addMemberRow.duplicateEntry",
    ); // [RTL 斷言]
  });
});
