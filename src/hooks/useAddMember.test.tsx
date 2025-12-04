import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

import { useAddMember } from "@/hooks/useAddMember";
import { addMember } from "@/lib/request/addMember";
import type { AddGroupMemberInput, GroupMember } from "@/types/group";
import { toast } from "sonner";

vi.mock("@/lib/request/addMember");

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

interface SuccessOptions {
  success: number;
  total: number;
}

const tMock = vi.fn(
  (key: string, defaultMessage?: string, option?: SuccessOptions): string => {
    if (
      key === "groupPages.addMemberPage.toastAllSuccess" &&
      defaultMessage &&
      option
    ) {
      return defaultMessage
        .replace("{{success}}", String(option.success))
        .replace("{{total}}", String(option.total));
    }
    if (key === "groupPages.addMemberPage.toastFail") {
      return defaultMessage ?? key;
    }
    return defaultMessage ?? key;
  },
);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: tMock,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// 看不懂
function createWrapper() {
  const queryClient = new QueryClient();

  return function Wrapper(props: { children: ReactNode }) {
    return createElement(QueryClientProvider, {
      client: queryClient,
      children: props.children,
    });
  };
}

// 看不懂
const mockedAddMember = vi.mocked(addMember);
const mockedToast = vi.mocked(toast, true);

describe("useAddMember", () => {
  it("shows success toast with summary when members are added successfully", async () => {
    const groupId = "groupId";

    const response: GroupMember[] = [
      {} as GroupMember,
      {} as GroupMember,
      {} as GroupMember,
    ];

    mockedAddMember.mockResolvedValueOnce(response);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useAddMember(groupId), { wrapper });

    const membersToAdd: AddGroupMemberInput[] = [{} as AddGroupMemberInput];

    await result.current.mutateAsync(membersToAdd);

    expect(mockedToast.success).toHaveBeenCalledTimes(1);

    const [message, options] = mockedToast.success.mock.calls[0];

    expect(message).toBe("3/3 members added successfully");

    expect(options).toEqual({ id: "add-member-summary" });
  });

  it("shows error toast with error.message when addMember fails", async () => {
    const groupId = "group-123";

    const error = new Error("backend exploded");
    mockedAddMember.mockRejectedValueOnce(error);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useAddMember(groupId), { wrapper });

    const membersToAdd: AddGroupMemberInput[] = [{} as AddGroupMemberInput];

    await result.current.mutateAsync(membersToAdd).catch(() => {});

    expect(mockedToast.error).toHaveBeenCalledTimes(1);

    const [message, options] = mockedToast.error.mock.calls[0];

    expect(message).toBe("backend exploded");

    expect(options).toEqual({ id: "add-member-error" });
  });
});
