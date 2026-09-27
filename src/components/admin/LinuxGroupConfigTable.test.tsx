import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LinuxGroupConfigTable from "./LinuxGroupConfigTable";
import type { LinuxGroup, LinuxGroupMember } from "@/types/linuxGroup";

const groups: LinuxGroup[] = [
  { name: "docker", gid: 985, memberCount: 2 },
  { name: "render", gid: 989, memberCount: 1 },
  { name: "sudo", gid: 27, memberCount: 1 },
  { name: "video", gid: 44, memberCount: 0 },
];

const dockerMembers: LinuxGroupMember[] = [
  {
    id: "docker-alice",
    userIdentifier: "313551000",
    fullName: "Alice Chen",
    linuxUsername: "alice",
  },
  {
    id: "docker-bob",
    userIdentifier: "313551001",
    fullName: "Bob Lin",
    linuxUsername: "bob",
  },
];

const mockGetLinuxGroups = vi.fn();
const mockGetLinuxGroupMembers = vi.fn();
const mockAddLinuxGroupMembers = vi.fn();
const mockRemoveLinuxGroupMember = vi.fn();

vi.mock("@/lib/request/linuxGroups", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/request/linuxGroups")
  >("@/lib/request/linuxGroups");

  return {
    linuxGroupQueryKeys: actual.linuxGroupQueryKeys,
    getLinuxGroups: (...args: unknown[]) => mockGetLinuxGroups(...args),
    getLinuxGroupMembers: (...args: unknown[]) =>
      mockGetLinuxGroupMembers(...args),
    addLinuxGroupMembers: (...args: unknown[]) =>
      mockAddLinuxGroupMembers(...args),
    removeLinuxGroupMember: (...args: unknown[]) =>
      mockRemoveLinuxGroupMember(...args),
  };
});

let autocompleteState = {
  debouncedQuery: "",
  suggestions: [] as { identifier: string }[],
  isLoadingSuggestions: false,
  isError: false,
};

vi.mock("@/hooks/useUserAutocomplete", () => ({
  useUserAutocomplete: () => ({
    query: "",
    setQuery: vi.fn(),
    showSuggestions: false,
    handleSelect: vi.fn(),
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    error: null,
    ...autocompleteState,
  }),
}));

function page<T>(items: T[]) {
  return {
    items,
    currentPage: 0,
    pageSize: 20,
    totalItems: items.length,
    totalPages: 1,
    hasNextPage: false,
  };
}

function renderTable() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <LinuxGroupConfigTable />
    </QueryClientProvider>,
  );
}

async function openGroupList(user: ReturnType<typeof userEvent.setup>) {
  const input = screen.getByLabelText("linuxGroupConfig.groupNameLabel");
  await user.click(input);
  return screen.findByRole("listbox");
}

/**
 * Controls that sit in a row alongside a Combobox are driven with fireEvent:
 * under jsdom the Combobox swallows the pointer sequence userEvent dispatches,
 * so `user.click` never reaches them. The handlers themselves are fine -- the
 * same Combobox-plus-buttons row ships in AddMemberRow.
 */
function userFields() {
  return screen.getAllByPlaceholderText("linuxGroupConfig.userPlaceholder");
}

function typeUser(index: number, value: string) {
  fireEvent.change(userFields()[index], { target: { value } });
}

/**
 * Types a group name and dismisses the suggestion popup. While the popup is
 * open it hides the rest of the page from the accessibility tree, so the
 * submit button is unreachable by role until it closes.
 */
async function typeGroupName(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) {
  await user.type(
    screen.getByLabelText("linuxGroupConfig.groupNameLabel"),
    name,
  );
  await user.keyboard("{Escape}");
}

describe("LinuxGroupConfigTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    autocompleteState = {
      debouncedQuery: "",
      suggestions: [],
      isLoadingSuggestions: false,
      isError: false,
    };
    mockGetLinuxGroups.mockResolvedValue(page(groups));
    mockGetLinuxGroupMembers.mockResolvedValue(page(dockerMembers));
  });

  it("lets the admin pick a different group after already picking one", async () => {
    const user = userEvent.setup();
    renderTable();

    await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

    const listbox = await openGroupList(user);
    await user.click(within(listbox).getByText("docker"));

    // The members card for the picked group shows up.
    expect(await screen.findByText("GID 985")).toBeInTheDocument();

    // Re-opening the list must still offer the other groups, otherwise the
    // admin is stuck with the first group they picked.
    const reopened = await openGroupList(user);
    expect(within(reopened).getByText("sudo")).toBeInTheDocument();
    expect(within(reopened).getByText("video")).toBeInTheDocument();
  });

  it("narrows the group list while the admin is still typing", async () => {
    const user = userEvent.setup();
    renderTable();

    await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

    const input = screen.getByLabelText("linuxGroupConfig.groupNameLabel");
    await user.type(input, "sud");

    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByText("sudo")).toBeInTheDocument();
    expect(within(listbox).queryByText("docker")).not.toBeInTheDocument();
  });

  it("adds and removes user rows", async () => {
    renderTable();

    await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

    expect(userFields()).toHaveLength(1);

    fireEvent.click(screen.getByLabelText("linuxGroupConfig.addRow"));
    expect(userFields()).toHaveLength(2);

    fireEvent.click(screen.getByLabelText("linuxGroupConfig.removeRow"));
    expect(userFields()).toHaveLength(1);
  });

  it("keeps the user field focused while the admin types into it", async () => {
    renderTable();

    await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

    const field = userFields()[0];
    field.focus();
    typeUser(0, "3");

    // A column model rebuilt from the current rows would hand the table a new
    // `cell` function, which is the component type it renders: the cell would
    // remount, swapping the input node out and dropping focus after the very
    // first keystroke.
    expect(userFields()[0]).toBe(field);
    expect(field).toHaveFocus();
  });

  it("submits the listed users against the typed group", async () => {
    const user = userEvent.setup();
    mockAddLinuxGroupMembers.mockResolvedValue({
      addedSuccessNumber: 1,
      addedFailureNumber: 0,
      errors: [],
    });
    renderTable();

    await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

    await typeGroupName(user, "docker");
    typeUser(0, "313551002");

    fireEvent.click(
      screen.getByRole("button", { name: "linuxGroupConfig.addToGroup" }),
    );

    await waitFor(() =>
      expect(mockAddLinuxGroupMembers).toHaveBeenCalledWith({
        name: "docker",
        members: ["313551002"],
      }),
    );

    // A clean run resets the form back to a single blank row.
    await waitFor(() => expect(userFields()[0]).toHaveValue(""));
  });

  it("keeps only the rejected rows and shows their errors", async () => {
    const user = userEvent.setup();
    mockAddLinuxGroupMembers.mockResolvedValue({
      addedSuccessNumber: 1,
      addedFailureNumber: 1,
      errors: [{ member: "999", message: "User not found" }],
    });
    renderTable();

    await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

    await typeGroupName(user, "docker");

    typeUser(0, "313551002");
    fireEvent.click(screen.getByLabelText("linuxGroupConfig.addRow"));
    typeUser(1, "999");

    fireEvent.click(
      screen.getByRole("button", { name: "linuxGroupConfig.addToGroup" }),
    );

    expect(await screen.findByText("User not found")).toBeInTheDocument();
    await waitFor(() => expect(userFields()).toHaveLength(1));
    expect(userFields()[0]).toHaveValue("999");
  });

  describe("directory lookup feedback", () => {
    it("stays quiet until a search has actually run", async () => {
      renderTable();

      await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

      expect(
        screen.queryByText("linuxGroupConfig.noUserMatch"),
      ).not.toBeInTheDocument();
    });

    it("says a non-matching identifier is still accepted", async () => {
      autocompleteState = {
        debouncedQuery: "allen920822@gmail.com",
        suggestions: [],
        isLoadingSuggestions: false,
        isError: false,
      };
      renderTable();

      await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

      expect(
        screen.getByText("linuxGroupConfig.noUserMatch"),
      ).toBeInTheDocument();
    });

    it("distinguishes a failed lookup from no match", async () => {
      autocompleteState = {
        debouncedQuery: "allen920822@gmail.com",
        suggestions: [],
        isLoadingSuggestions: false,
        isError: true,
      };
      renderTable();

      await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

      expect(
        screen.getByText("linuxGroupConfig.userSearchFailed"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("linuxGroupConfig.noUserMatch"),
      ).not.toBeInTheDocument();
    });

    it("gives the row error precedence over the lookup hint", async () => {
      const user = userEvent.setup();
      autocompleteState = {
        debouncedQuery: "999",
        suggestions: [],
        isLoadingSuggestions: false,
        isError: false,
      };
      mockAddLinuxGroupMembers.mockResolvedValue({
        addedSuccessNumber: 0,
        addedFailureNumber: 1,
        errors: [{ member: "999", message: "Already in this group" }],
      });
      renderTable();

      await waitFor(() => expect(mockGetLinuxGroups).toHaveBeenCalled());

      await typeGroupName(user, "docker");
      typeUser(0, "999");
      fireEvent.click(
        screen.getByRole("button", { name: "linuxGroupConfig.addToGroup" }),
      );

      expect(
        await screen.findByText("Already in this group"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("linuxGroupConfig.noUserMatch"),
      ).not.toBeInTheDocument();
    });
  });
});
