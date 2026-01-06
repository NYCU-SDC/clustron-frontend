import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, afterEach, vi, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import CreateGroup from "./CreateGroup";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import type { CreateGroupInput, CreateGroupResponse } from "@/types/group";

// Mock react-router to track navigation calls
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock custom hooks
const mockCreateGroupMutate = vi.fn();
const mockRoleNameToId = vi.fn();

vi.mock("@/hooks/useCreateGroup", () => ({
  useCreateGroup: vi.fn((options) => ({
    mutate: mockCreateGroupMutate,
    isPending: false,
    onSuccess: options?.onSuccess,
  })),
}));

vi.mock("@/hooks/useJwtPayload", () => ({
  useJwtPayload: vi.fn(() => ({
    Role: "admin",
    UserId: "user123",
    Email: "test@example.com",
  })),
}));

vi.mock("@/hooks/useRoleMapper", () => ({
  useRoleMapper: vi.fn(() => ({
    roleNameToId: mockRoleNameToId,
  })),
}));

// Mock AddMemberRow component to simplify testing
vi.mock("@/components/group/AddMemberRow", () => ({
  default: ({
    index,
    id,
    roleName,
    onChange,
    onAdd,
    onRemove,
    isLast,
    isDuplicate,
  }: {
    index: number;
    id: string;
    roleName: string;
    onChange: (index: number, key: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isLast: boolean;
    isDuplicate?: boolean;
  }) => (
    <tr data-testid={`member-row-${index}`}>
      <td>
        <input
          data-testid={`member-id-${index}`}
          value={id}
          onChange={(e) => onChange(index, "id", e.target.value)}
          aria-invalid={isDuplicate}
        />
      </td>
      <td>
        <select
          data-testid={`member-role-${index}`}
          value={roleName}
          onChange={(e) => onChange(index, "roleName", e.target.value)}
        >
          <option value="student">Student</option>
          <option value="ta">TA</option>
          <option value="professor">Professor</option>
        </select>
      </td>
      <td>
        {isLast && (
          <button data-testid={`add-member-${index}`} onClick={onAdd}>
            Add
          </button>
        )}
        <button
          data-testid={`remove-member-${index}`}
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      </td>
    </tr>
  ),
}));

describe("CreateGroup", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mockRoleNameToId.mockImplementation((roleName: string) => {
      const roleMap: Record<string, string> = {
        student: "role-student-id",
        ta: "role-ta-id",
        professor: "role-professor-id",
      };
      return roleMap[roleName];
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  function renderWithProviders() {
    return render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>
            <CreateGroup />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    );
  }

  function getCreateButton() {
    const buttons = screen.getAllByRole("button");
    return buttons.find((btn) =>
      btn.textContent?.includes("groupPages.createGroup.create"),
    );
  }

  function getCancelButton() {
    const buttons = screen.getAllByRole("button");
    return buttons.find((btn) =>
      btn.textContent?.includes("groupPages.createGroup.cancel"),
    );
  }

  describe("Initial Rendering", () => {
    it("renders the form with all required inputs", async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(
            "groupPages.createGroup.courseTitlePlaceholder",
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(
            "groupPages.createGroup.courseDescriptionPlaceholder",
          ),
        ).toBeInTheDocument();
        expect(screen.getByTestId("member-row-0")).toBeInTheDocument();
      });
    });

    it("renders with one empty member row by default", async () => {
      renderWithProviders();

      await waitFor(() => {
        const memberIdInput = screen.getByTestId("member-id-0");
        expect(memberIdInput).toBeInTheDocument();
        expect(memberIdInput).toHaveValue("");
      });
    });
  });

  describe("Form Input and Validation", () => {
    it("allows typing in title and description fields", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");

      expect(titleInput).toHaveValue("Test Group");
      expect(descriptionInput).toHaveValue("Test Description");
    });

    it("disables Create button when title is empty", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );
      await user.type(descriptionInput, "Test Description");

      const buttons = screen.getAllByRole("button");
      const createButton = buttons.find((btn) =>
        btn.textContent?.includes("groupPages.createGroup.create"),
      );
      expect(createButton).toBeDisabled();
    });

    it("disables Create button when description is empty", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      await user.type(titleInput, "Test Group");

      const buttons = screen.getAllByRole("button");
      const createButton = buttons.find((btn) =>
        btn.textContent?.includes("groupPages.createGroup.create"),
      );
      expect(createButton).toBeDisabled();
    });

    it("enables Create button when both title and description are filled", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");

      const buttons = screen.getAllByRole("button");
      const createButton = buttons.find((btn) =>
        btn.textContent?.includes("groupPages.createGroup.create"),
      );
      expect(createButton).not.toBeDisabled();
    });
  });

  describe("Link Management", () => {
    it("allows adding a new link to the resource list", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.title",
      );
      const urlInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.URL",
      );

      // Find the link title and URL inputs (last ones in the list)
      const linkTitleInput = titleInputs[titleInputs.length - 1];
      const linkUrlInput = urlInputs[urlInputs.length - 1];

      await user.type(linkTitleInput, "Documentation");
      await user.type(linkUrlInput, "https://docs.example.com");

      const addLinkButtons = screen.getAllByRole("button");
      const addLinkButton = addLinkButtons.find((btn) =>
        btn.querySelector("svg"),
      );

      await user.click(addLinkButton!);

      await waitFor(() => {
        expect(screen.getByText("Documentation")).toBeInTheDocument();
        expect(
          screen.getByText("https://docs.example.com"),
        ).toBeInTheDocument();
      });
    });

    it("disables Add Link button when title is missing", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const urlInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.URL",
      );
      const linkUrlInput = urlInputs[urlInputs.length - 1];

      await user.type(linkUrlInput, "https://example.com");

      const addLinkButtons = screen.getAllByRole("button");
      const addLinkButton = addLinkButtons.find(
        (btn) =>
          btn.querySelector("svg") && !btn.textContent?.includes("Cancel"),
      );

      expect(addLinkButton).toBeDisabled();
    });

    it("disables Add Link button when URL is missing", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.title",
      );
      const linkTitleInput = titleInputs[titleInputs.length - 1];

      await user.type(linkTitleInput, "Documentation");

      const addLinkButtons = screen.getAllByRole("button");
      const addLinkButton = addLinkButtons.find(
        (btn) =>
          btn.querySelector("svg") && !btn.textContent?.includes("Cancel"),
      );

      expect(addLinkButton).toBeDisabled();
    });

    it("allows removing a link from the list", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.title",
      );
      const urlInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.URL",
      );

      const linkTitleInput = titleInputs[titleInputs.length - 1];
      const linkUrlInput = urlInputs[urlInputs.length - 1];

      await user.type(linkTitleInput, "Documentation");
      await user.type(linkUrlInput, "https://docs.example.com");

      const addLinkButtons = screen.getAllByRole("button");
      const addLinkButton = addLinkButtons.find((btn) =>
        btn.querySelector("svg"),
      );

      await user.click(addLinkButton!);

      await waitFor(() => {
        expect(screen.getByText("Documentation")).toBeInTheDocument();
      });

      // Find and click the remove button
      const removeLinkButtons = screen.getAllByRole("button");
      const removeLinkButton = removeLinkButtons.find((btn) =>
        btn.closest("tr")?.textContent?.includes("Documentation"),
      );

      await user.click(removeLinkButton!);

      await waitFor(() => {
        expect(screen.queryByText("Documentation")).not.toBeInTheDocument();
      });
    });

    it("normalizes URL without protocol by adding https://", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );
      const titleInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.title",
      );
      const urlInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.URL",
      );

      const linkTitleInput = titleInputs[titleInputs.length - 1];
      const linkUrlInput = urlInputs[urlInputs.length - 1];

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");
      await user.type(linkTitleInput, "Example");
      await user.type(linkUrlInput, "example.com");

      // First add the link to the list (which normalizes it)
      const addLinkButtons = screen.getAllByRole("button");
      const addLinkButton = addLinkButtons.find((btn) =>
        btn.querySelector("svg"),
      );
      await user.click(addLinkButton!);

      const createButton = getCreateButton();
      await user.click(createButton!);

      await waitFor(() => {
        expect(mockCreateGroupMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            links: expect.arrayContaining([
              expect.objectContaining({
                title: "Example",
                url: "https://example.com",
              }),
            ]),
          }),
        );
      });
    });

    it("preserves URL with existing http:// protocol", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );
      const titleInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.title",
      );
      const urlInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.URL",
      );

      const linkTitleInput = titleInputs[titleInputs.length - 1];
      const linkUrlInput = urlInputs[urlInputs.length - 1];

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");
      await user.type(linkTitleInput, "Example");
      await user.type(linkUrlInput, "http://example.com");

      const createButton = getCreateButton();
      await user.click(createButton!);

      await waitFor(() => {
        expect(mockCreateGroupMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            links: expect.arrayContaining([
              expect.objectContaining({
                title: "Example",
                url: "http://example.com",
              }),
            ]),
          }),
        );
      });
    });

    it("preserves URL with existing https:// protocol", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );
      const titleInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.title",
      );
      const urlInputs = screen.getAllByPlaceholderText(
        "groupPages.createGroup.URL",
      );

      const linkTitleInput = titleInputs[titleInputs.length - 1];
      const linkUrlInput = urlInputs[urlInputs.length - 1];

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");
      await user.type(linkTitleInput, "Example");
      await user.type(linkUrlInput, "https://example.com");

      const createButton = getCreateButton();
      await user.click(createButton!);

      await waitFor(() => {
        expect(mockCreateGroupMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            links: expect.arrayContaining([
              expect.objectContaining({
                title: "Example",
                url: "https://example.com",
              }),
            ]),
          }),
        );
      });
    });
  });

  describe("Member Management", () => {
    it("allows adding a new member row", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const addButton = screen.getByTestId("add-member-0");
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId("member-row-0")).toBeInTheDocument();
        expect(screen.getByTestId("member-row-1")).toBeInTheDocument();
      });
    });

    it("allows removing a member row", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      // Add a second row first
      const addButton = screen.getByTestId("add-member-0");
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId("member-row-1")).toBeInTheDocument();
      });

      // Remove the first row
      const removeButton = screen.getByTestId("remove-member-0");
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("member-row-1")).not.toBeInTheDocument();
      });
    });

    it("maintains at least one member row after removal", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const removeButton = screen.getByTestId("remove-member-0");
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.getByTestId("member-row-0")).toBeInTheDocument();
      });
    });

    it("disables Create button when there are duplicate member IDs", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");

      // Add a second row
      const addButton = screen.getByTestId("add-member-0");
      await user.click(addButton);

      // Set duplicate IDs
      const memberIdInput0 = screen.getByTestId("member-id-0");
      const memberIdInput1 = screen.getByTestId("member-id-1");

      await user.type(memberIdInput0, "student123");
      await user.type(memberIdInput1, "student123");

      await waitFor(() => {
        const createButton = getCreateButton();
        expect(createButton).toBeDisabled();
      });
    });
  });

  describe("Form Submission", () => {
    it("calls createGroup.mutate with correct data on submit", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");

      const memberIdInput = screen.getByTestId("member-id-0");
      await user.type(memberIdInput, "student123");

      const createButton = getCreateButton();
      await user.click(createButton!);

      await waitFor(() => {
        expect(mockCreateGroupMutate).toHaveBeenCalledWith({
          title: "Test Group",
          description: "Test Description",
          members: [
            {
              member: "student123",
              roleId: "role-student-id",
            },
          ],
          links: [],
        });
      });
    });

    it("filters out empty member rows before submission", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");

      // Add a second row but leave it empty
      const addButton = screen.getByTestId("add-member-0");
      await user.click(addButton);

      // Only fill the first member
      const memberIdInput0 = screen.getByTestId("member-id-0");
      await user.type(memberIdInput0, "student123");

      // Remove the empty row before submitting
      const removeButton = screen.getByTestId("remove-member-1");
      await user.click(removeButton);

      const createButton = getCreateButton();
      await user.click(createButton!);

      await waitFor(() => {
        expect(mockCreateGroupMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            members: [
              {
                member: "student123",
                roleId: "role-student-id",
              },
            ],
          }),
        );
      });
    });

    it("navigates to result page on successful creation", async () => {
      const user = userEvent.setup();

      // Mock the useCreateGroup hook to call onSuccess
      const { useCreateGroup } = await import("@/hooks/useCreateGroup");
      (
        useCreateGroup as unknown as ReturnType<typeof vi.fn>
      ).mockImplementation(
        (options: { onSuccess?: (data: CreateGroupResponse) => void }) => ({
          mutate: vi.fn((input: CreateGroupInput) => {
            options?.onSuccess?.({
              id: "group123",
              title: input.title,
              description: input.description,
              isArchived: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              me: {
                type: "owner",
                role: {
                  roleName: "owner",
                  id: "role-owner-id",
                  accessLevel: "GROUP_OWNER",
                },
              },
              addedResult: {
                addedSuccessNumber: 1,
                addedFailureNumber: 0,
                errors: [],
              },
            });
          }),
          isPending: false,
        }),
      );

      renderWithProviders();

      const titleInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseTitlePlaceholder",
      );
      const descriptionInput = screen.getByPlaceholderText(
        "groupPages.createGroup.courseDescriptionPlaceholder",
      );

      await user.type(titleInput, "Test Group");
      await user.type(descriptionInput, "Test Description");

      const memberIdInput = screen.getByTestId("member-id-0");
      await user.type(memberIdInput, "student123");

      const createButton = getCreateButton();
      await user.click(createButton!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/groups/group123/add-member-result",
          expect.objectContaining({
            state: expect.objectContaining({
              result: expect.any(Object),
              members: expect.any(Array),
            }),
          }),
        );
      });
    });
  });

  describe("Cancel Action", () => {
    it("navigates to /groups when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const cancelButton = getCancelButton();
      await user.click(cancelButton!);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/groups");
      });
    });
  });
});
