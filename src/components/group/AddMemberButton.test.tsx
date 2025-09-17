// src/components/group/AddMemberButton.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddMemberButton from "./AddMemberButton";

// mock router: useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("AddMemberButton", () => {
  it("渲染按鈕與文案（文案=key）", () => {
    render(<AddMemberButton groupId="g1" />);
    // i18n 被全域 mock → 文案= key
    expect(
      screen.getByRole("button", {
        name: "groupComponents.addMemberButton.newMembers",
      }),
    ).toBeInTheDocument();
  });

  it("isArchived 時 disabled 且不導頁", async () => {
    const user = userEvent.setup();
    render(<AddMemberButton groupId="g1" isArchived />);
    const btn = screen.getByRole("button", {
      name: "groupComponents.addMemberButton.newMembers",
    });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("可點時導向正確路徑", async () => {
    const user = userEvent.setup();
    render(<AddMemberButton groupId="g1" />);
    await user.click(
      screen.getByRole("button", {
        name: "groupComponents.addMemberButton.newMembers",
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/groups/g1/add-member");
  });
});
