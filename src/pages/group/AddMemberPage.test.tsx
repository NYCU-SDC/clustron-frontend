import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import AddMemberPage from "./AddMemberPage";
import { UseAddMemberOptions } from "@/hooks/useAddMember";
import { AddMembersResult } from "@/types/group";

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: "g1" }), // this page needs groupId param
    MemoryRouter: actual.MemoryRouter,
    Route: actual.Route,
    Routes: actual.Routes,
  };
});

const mutateMock = vi.fn();

// extract the onSuccess callback pass into the hook so tests can trigger it
let onSuccessFromHook:
  | ((data: AddMembersResult) => void | Promise<void>)
  | undefined;

vi.mock("@/hooks/useAddMember", () => ({
  useAddMember: (_groupId: string, opts: UseAddMemberOptions) => {
    onSuccessFromHook = opts?.onSuccess;
    return { mutate: mutateMock, isPending: false };
  },
}));

type GroupData = { id: string; me: { role: { accessLevel: number } } } | null;
let getGroupResult: { data: GroupData; isLoading: boolean } = {
  data: {
    id: "g1",
    me: { role: { accessLevel: 1 } },
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
    getRolesByAccessLevel: () => [
      { id: "RID_STUDENT", roleName: "student", accessLevel: "USER" },
      { id: "RID_TA", roleName: "ta", accessLevel: "USER" },
    ],
  }),
}));

vi.mock("@/hooks/useJwtPayload", () => ({
  useJwtPayload: () => ({ Role: "Admin" }), // 只是傳給 row，用不到細節
}));

vi.mock("@/lib/permission", () => ({
  GlobalRole: { Admin: "Admin" },
}));

vi.mock("@/components/ui/table", () => ({
  Table: (p: ComponentProps<"table">) => <table {...p} />,
  TableHeader: (p: ComponentProps<"thead">) => <thead {...p} />,
  TableRow: (p: ComponentProps<"tr">) => <tr {...p} />,
  TableHead: (p: ComponentProps<"th">) => <th {...p} />,
  TableBody: (p: ComponentProps<"tbody">) => <tbody {...p} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: ComponentProps<"button">) => (
    <button {...rest}>{children}</button>
  ),
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
  }: {
    index: number;
    id: string;
    roleName: string;
    onChange: (index: number, field: "id" | "roleName", value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isLast?: boolean;
    onAddBatch?: (items: Array<{ id: string; roleName: string }>) => void;
    isDuplicate?: boolean;
  }) {
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
  it("Should show loading text when group is loading", () => {
    getGroupResult = { data: null, isLoading: true };
    renderPage();
    expect(
      screen.getByText("groupPages.addMemberPage.loading"),
    ).toBeInTheDocument();
  });

  it("Should show not found text when group is not found", () => {
    getGroupResult = { data: null, isLoading: false };
    renderPage();
    expect(
      screen.getByText("groupPages.addMemberPage.courseNotFound"),
    ).toBeInTheDocument();
  });

  it("Should show duplicate warning and disable Save button when duplicate member is added. Should be able to add/remove rows.", async () => {
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

  it("Should save member data with correct role ID mapping", async () => {
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

  it("Should cancel and redirect to settings", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: "groupPages.addMemberPage.cancel" }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/groups/g1/settings");
  });

  it("Should add batch members and save them together", async () => {
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

  it("Should navigate to settings after successful save", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("member-0"), "s1@example.com");
    await user.click(
      screen.getByRole("button", { name: "groupPages.addMemberPage.save" }),
    );

    // mock useAddMember success
    onSuccessFromHook?.({
      addedSuccessNumber: 1,
      addedFailureNumber: 0,
    } as AddMembersResult);

    expect(navigateMock).toHaveBeenCalledWith("/groups/g1/settings");
  });
});
