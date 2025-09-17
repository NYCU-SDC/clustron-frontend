import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddMemberPage from "./AddMemberPage";
// import React from "react";

/**
 * ---------  mock：router / i18n ----------
 */
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: "g1" }), // 這頁會用到 groupId
    MemoryRouter: actual.MemoryRouter,
    Route: actual.Route,
    Routes: actual.Routes,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }), // 直接回傳 key 當文案
}));

/**
 * --------- 需要的 hooks / 元件 mock ----------
 */
const mutateMock = vi.fn();
let onSuccessFromHook: ((...args: any[]) => void) | undefined;

vi.mock("@/hooks/useAddMember", () => ({
  useAddMember: (
    _groupId: string,
    opts: { onSuccess?: (...args: any[]) => void },
  ) => {
    onSuccessFromHook = opts?.onSuccess;
    return { mutate: mutateMock, isPending: false };
  },
}));

let getGroupResult: { data: any; isLoading: boolean } = {
  data: {
    id: "g1",
    me: { role: { accessLevel: 1 } }, // AccessLevelUser 類似數值就好
  },
  isLoading: false,
};
vi.mock("@/hooks/useGetGroupById", () => ({
  useGetGroupById: () => getGroupResult,
}));

vi.mock("@/hooks/useRoleMapper", () => ({
  useRoleMapper: () => ({
    // 測試重點：把 roleName 轉 id
    roleNameToId: (name: string) =>
      ({ student: "RID_STUDENT", ta: "RID_TA" })[name] ?? null,
  }),
}));

vi.mock("@/hooks/useJwtPayload", () => ({
  useJwtPayload: () => ({ Role: "Admin" }), // 只是傳給 row，用不到細節
}));

vi.mock("@/lib/permission", () => ({
  GlobalRole: { Admin: "Admin" },
}));

vi.mock("@/components/ui/table", () => ({
  Table: (p: any) => <table {...p} />,
  TableHeader: (p: any) => <thead {...p} />,
  TableRow: (p: any) => <tr {...p} />,
  TableHead: (p: any) => <th {...p} />,
  TableBody: (p: any) => <tbody {...p} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
}));

vi.mock("@/components/group/AddMemberRow", () => ({
  default: function MockRow({
    index,
    id,
    roleName,
    onChange,
    onAdd,
    onRemove,
    isLast,
    onAddBatch,
    isDuplicate,
  }: any) {
    return (
      <tr data-testid={`row-${index}`}>
        <td>
          <input
            aria-label={`member-${index}`}
            value={id}
            onChange={(e) => onChange(index, "id", e.target.value)}
          />
          {isDuplicate && <span role="alert">duplicate</span>}
        </td>
        <td>
          <select
            aria-label={`role-${index}`}
            value={roleName}
            onChange={(e) => onChange(index, "roleName", e.target.value)}
          >
            <option value="student">student</option>
            <option value="ta">ta</option>
          </select>
        </td>
        <td>
          {isLast && (
            <button aria-label="add-row" onClick={onAdd}>
              +
            </button>
          )}
          <button
            aria-label={`remove-row-${index}`}
            onClick={() => onRemove(index)}
          >
            -
          </button>
          <button
            aria-label={`add-batch-${index}`}
            onClick={() =>
              onAddBatch?.([{ id: "b1@example.com", roleName: "student" }])
            }
          >
            add-batch
          </button>
        </td>
      </tr>
    );
  },
}));

/**
 * ------------------- 測試 -------------------
 */
const renderPage = () => render(<AddMemberPage />);

beforeEach(() => {
  vi.clearAllMocks();
  // 預設 group 有資料、不是 loading
  getGroupResult = {
    data: { id: "g1", me: { role: { accessLevel: 1 } } },
    isLoading: false,
  };
});

describe("AddMemberPage", () => {
  it("loading 時顯示 loading 文案", () => {
    getGroupResult = { data: null, isLoading: true };
    renderPage();
    expect(
      screen.getByText("groupPages.addMemberPage.loading"),
    ).toBeInTheDocument();
  });

  it("找不到 group 時顯示 not found 文案", () => {
    getGroupResult = { data: null, isLoading: false };
    renderPage();
    expect(
      screen.getByText("groupPages.addMemberPage.courseNotFound"),
    ).toBeInTheDocument();
  });

  it("可新增/移除列，重複成員時 Save 會被禁用", async () => {
    const user = userEvent.setup();
    renderPage();

    // 預設只有一列，可點最後一列上的 "+"
    await user.click(screen.getByLabelText("add-row")); // 新增第二列
    // 設定兩列為同一個 id
    await user.type(screen.getByLabelText("member-0"), "foo@example.com");
    await user.type(screen.getByLabelText("member-1"), "foo@example.com");

    // 兩列都應標示 duplicate，且 Save disabled
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent("duplicate");
    const saveBtn = screen.getByRole("button", {
      name: "groupPages.addMemberPage.save",
    });
    expect(saveBtn).toBeDisabled();

    // 把第二列移除 → Save 應可用
    await user.click(screen.getByLabelText("remove-row-1"));
    expect(saveBtn).toBeEnabled();
  });

  it("點 Save 會把 roleName 轉成 roleId 後呼叫 mutate", async () => {
    const user = userEvent.setup();
    renderPage();

    // 輸入一列資料（student → RID_STUDENT）
    await user.type(screen.getByLabelText("member-0"), "s1@example.com");
    await user.selectOptions(screen.getByLabelText("role-0"), "student");

    await user.click(
      screen.getByRole("button", { name: "groupPages.addMemberPage.save" }),
    );

    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock).toHaveBeenCalledWith([
      { member: "s1@example.com", roleId: "RID_STUDENT" },
    ]);
  });

  it("按 Cancel 會導向 settings", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: "groupPages.addMemberPage.cancel" }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/groups/g1/settings");
  });

  it("批次新增(onAddBatch) 也能被加入 members 再一起送出", async () => {
    const user = userEvent.setup();
    renderPage();

    // 第一列填入一筆
    await user.type(screen.getByLabelText("member-0"), "s1@example.com");

    // 透過 row 的 add-batch 按鈕加入一筆(b1@example.com)
    await user.click(screen.getByLabelText("add-batch-0"));

    // 送出
    await user.click(
      screen.getByRole("button", { name: "groupPages.addMemberPage.save" }),
    );

    expect(mutateMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        { member: "s1@example.com", roleId: "RID_STUDENT" },
        { member: "b1@example.com", roleId: "RID_STUDENT" },
      ]),
    );
  });

  it("成功後 hook 觸發 onSuccess → auto redirect to settings", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("member-0"), "s1@example.com");
    await user.click(
      screen.getByRole("button", { name: "groupPages.addMemberPage.save" }),
    );

    // mock useAddMember success
    onSuccessFromHook?.();

    expect(navigateMock).toHaveBeenCalledWith("/groups/g1/settings");
  });
});
