import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import GroupDescription from "./GroupDescription";
import {
  createGroupLink,
  deleteGroupLink,
  updateGroupLink,
} from "@/lib/request/groupLinks.ts";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback ?? _key,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/request/updateGroupTitle", () => ({
  updateGroupTitle: vi.fn(),
}));

vi.mock("@/lib/request/updateGroupDescription", () => ({
  updateGroupDescription: vi.fn(),
}));

vi.mock("@/lib/request/groupLinks", () => ({
  createGroupLink: vi.fn(),
  deleteGroupLink: vi.fn(),
  updateGroupLink: vi.fn(),
}));

const mockedCreateGroupLink = vi.mocked(createGroupLink);
const mockedDeleteGroupLink = vi.mocked(deleteGroupLink);
const mockedUpdateGroupLink = vi.mocked(updateGroupLink);

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    ),
  };
}

describe("GroupDescription", () => {
  beforeEach(() => {
    mockedCreateGroupLink.mockResolvedValue({} as never);
    mockedDeleteGroupLink.mockResolvedValue(undefined as never);
    mockedUpdateGroupLink.mockResolvedValue({} as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates, updates, and deletes group links when saving link edits", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <GroupDescription
        groupId="group-1"
        title="Test Group"
        ldapGroupName="test-group"
        desc="Test Description"
        editable
        links={[
          {
            id: "link-1",
            title: "Old Docs",
            url: "https://old.example.com",
          },
          {
            id: "link-2",
            title: "Remove Me",
            url: "https://remove.example.com",
          },
        ]}
      />,
    );

    await user.click(screen.getByLabelText("Edit group links"));

    const oldDocsInput = screen.getByDisplayValue("Old Docs");
    const oldDocsRow = oldDocsInput.closest("tr")!;

    await user.clear(oldDocsInput);
    await user.type(oldDocsInput, "Updated Docs");

    const oldDocsUrlInput = within(oldDocsRow).getByDisplayValue(
      "https://old.example.com",
    );

    await user.clear(oldDocsUrlInput);
    await user.type(oldDocsUrlInput, "updated.example.com");

    const removeMeRow = screen.getByDisplayValue("Remove Me").closest("tr")!;
    await user.click(within(removeMeRow).getByRole("button"));

    const titleInputs = screen.getAllByPlaceholderText(
      "groupPages.createGroup.title",
    );
    const urlInputs = screen.getAllByPlaceholderText(
      "groupPages.createGroup.URL",
    );

    const newLinkTitleInput = titleInputs[titleInputs.length - 1];
    const newLinkUrlInput = urlInputs[urlInputs.length - 1];

    await user.type(newLinkTitleInput, "New Link");
    await user.type(newLinkUrlInput, "new.example.com");

    const newLinkRow = newLinkTitleInput.closest("tr")!;
    await user.click(within(newLinkRow).getByRole("button"));

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockedUpdateGroupLink).toHaveBeenCalledWith("group-1", "link-1", {
        title: "Updated Docs",
        url: "https://updated.example.com",
      });
    });

    expect(mockedDeleteGroupLink).toHaveBeenCalledWith("group-1", "link-2");

    expect(mockedCreateGroupLink).toHaveBeenCalledWith({
      groupId: "group-1",
      payload: {
        title: "New Link",
        url: "https://new.example.com",
      },
    });
  });
});
