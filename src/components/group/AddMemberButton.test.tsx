// src/components/group/AddMemberButton.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddMemberButton from "./AddMemberButton";

// mock router: useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("AddMemberButton", () => {
  it("Should render the button with correct text", () => {
    render(<AddMemberButton groupId="g1" />);
    expect(
      screen.getByRole("button", {
        name: "groupComponents.addMemberButton.newMembers",
      }),
    ).toBeInTheDocument();
  });

  it("Should be disabled when isArchived is true", async () => {
    const user = userEvent.setup();
    render(<AddMemberButton groupId="g1" isArchived />);
    const btn = screen.getByRole("button", {
      name: "groupComponents.addMemberButton.newMembers",
    });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("Should navigate to correct path when enabled", async () => {
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
