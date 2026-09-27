import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { toast } from "sonner";
import { CircleMinus, CirclePlus, Loader2, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DataTable,
  createDataTableColumnHelper,
  type DataTableColumns,
} from "@/components/ui/data-table";
import PaginationControls from "@/components/customUI/PaginationControl";
import { useUserAutocomplete } from "@/hooks/useUserAutocomplete";
import {
  addLinuxGroupMembers,
  getLinuxGroupMembers,
  getLinuxGroups,
  linuxGroupQueryKeys,
  removeLinuxGroupMember,
} from "@/lib/request/linuxGroups";
import {
  isValidLinuxGroupName,
  type AddLinuxGroupMembersRequest,
  type AddLinuxGroupMembersResult,
  type LinuxGroupMember,
  type RemoveLinuxGroupMemberRequest,
} from "@/types/linuxGroup";
import { getErrMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

type UserRow = {
  rowId: string;
  id: string;
  error?: string;
};

/**
 * A row plus the flags that depend on the whole set. They travel on the row
 * instead of being closed over by the column defs because `cell` is the
 * component type the table renders: rebuilding the columns whenever a row
 * changes would remount the cell and throw focus out of the field being
 * typed into. The column model must therefore stay independent of `rows`.
 */
type UserRowView = UserRow & {
  isDuplicate: boolean;
  isLast: boolean;
};

const memberHelper = createDataTableColumnHelper<LinuxGroupMember>();
const userRowHelper = createDataTableColumnHelper<UserRowView>();

function emptyRow(): UserRow {
  return { rowId: crypto.randomUUID(), id: "" };
}

function getMemberColumns({
  t,
  onRemove,
}: {
  t: TFunction;
  onRemove: (member: LinuxGroupMember) => void;
}) {
  const columns: DataTableColumns<LinuxGroupMember> = [
    memberHelper.accessor("fullName", {
      header: t("linuxGroupConfig.tableHeadName"),
      cell: ({ row, getValue }) => (
        <div className="flex flex-col">
          <span className="font-medium">{getValue()}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.userIdentifier}
          </span>
        </div>
      ),
    }),
    memberHelper.accessor("linuxUsername", {
      header: t("linuxGroupConfig.tableHeadLinuxUsername"),
      meta: {
        headClassName: "hidden sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue()}</span>
      ),
    }),
    memberHelper.display({
      id: "actions",
      header: "",
      meta: { cellClassName: "text-right pr-2" },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-800"
          aria-label={t("linuxGroupConfig.removeFromGroup")}
          onClick={() => onRemove(row.original)}
        >
          <Trash2 size={16} />
        </Button>
      ),
    }),
  ];

  return columns;
}

/**
 * The student id / email field for one "user to add" row. It is its own
 * component because each row drives an independent autocomplete query.
 */
function UserIdentifierCell({
  row,
  isDuplicate,
  disabled,
  onChange,
  onAddBatch,
}: {
  row: UserRow;
  isDuplicate: boolean;
  disabled: boolean;
  onChange: (rowId: string, value: string) => void;
  onAddBatch: (ids: string[]) => void;
}) {
  const { t } = useTranslation();
  const {
    query,
    setQuery,
    debouncedQuery,
    suggestions,
    showSuggestions,
    handleSelect,
    isLoadingSuggestions,
    isError,
  } = useUserAutocomplete();

  /**
   * Feedback about the directory lookup, rendered under the field rather than
   * inside the popup: Combobox does not open the popup when there is nothing
   * to list, so a failed or empty search would otherwise be entirely silent.
   *
   * The lookup is a convenience, not a constraint -- whatever is typed is
   * submitted as-is -- so both messages say the identifier is still accepted
   * instead of reading as a rejection.
   */
  let lookupHint = "";
  if (isError) {
    lookupHint = t("linuxGroupConfig.userSearchFailed");
  } else if (
    debouncedQuery &&
    !isLoadingSuggestions &&
    suggestions.length === 0
  ) {
    lookupHint = t("linuxGroupConfig.noUserMatch");
  }

  return (
    <Combobox items={suggestions}>
      <ComboboxInput
        showTrigger={false}
        value={query || row.id}
        disabled={disabled}
        placeholder={t("linuxGroupConfig.userPlaceholder")}
        className={cn(
          "h-10 w-full text-sm",
          (isDuplicate || row.error) && "border-red-500 bg-red-50",
        )}
        title={isDuplicate ? t("linuxGroupConfig.duplicateEntry") : ""}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(row.rowId, e.target.value);
        }}
        onPaste={(e) => {
          const pasted = e.clipboardData
            .getData("text")
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean);

          if (pasted.length > 1) {
            e.preventDefault();
            onAddBatch(pasted);
          }
        }}
      />
      {row.error ? (
        <p className="mt-1 text-xs break-all text-red-500">{row.error}</p>
      ) : (
        lookupHint && (
          <p className="text-muted-foreground mt-1 text-xs">{lookupHint}</p>
        )
      )}
      <ComboboxContent>
        <ComboboxEmpty>{t("linuxGroupConfig.noUserMatch")}</ComboboxEmpty>
        {showSuggestions && suggestions.length > 0 && (
          <ComboboxList>
            {(user) => (
              <ComboboxItem
                key={user.identifier}
                value={user.identifier}
                onClick={() => {
                  handleSelect(user);
                  onChange(row.rowId, user.identifier);
                }}
              >
                {user.identifier}
              </ComboboxItem>
            )}
          </ComboboxList>
        )}
      </ComboboxContent>
    </Combobox>
  );
}

function getUserRowColumns({
  t,
  disabled,
  onChange,
  onAddBatch,
  onRemove,
  onAdd,
}: {
  t: TFunction;
  disabled: boolean;
  onChange: (rowId: string, value: string) => void;
  onAddBatch: (ids: string[]) => void;
  onRemove: (rowId: string) => void;
  onAdd: () => void;
}) {
  const columns: DataTableColumns<UserRowView> = [
    userRowHelper.display({
      id: "identifier",
      header: t("linuxGroupConfig.tableHeadUser"),
      cell: ({ row }) => (
        <UserIdentifierCell
          row={row.original}
          isDuplicate={row.original.isDuplicate}
          disabled={disabled}
          onChange={onChange}
          onAddBatch={onAddBatch}
        />
      ),
    }),
    userRowHelper.display({
      id: "actions",
      header: "",
      meta: { headClassName: "w-16", cellClassName: "w-16 text-center" },
      cell: ({ row }) =>
        row.original.isLast ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAdd}
            disabled={disabled}
            aria-label={t("linuxGroupConfig.addRow")}
            className="text-gray-600 hover:text-black"
          >
            <CirclePlus size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(row.original.rowId)}
            disabled={disabled}
            aria-label={t("linuxGroupConfig.removeRow")}
            className="text-red-600 hover:text-red-800"
          >
            <CircleMinus size={16} />
          </Button>
        ),
    }),
  ];

  return columns;
}

export default function LinuxGroupConfigTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState("");
  const [rows, setRows] = useState<UserRow[]>([emptyRow()]);
  const [memberPage, setMemberPage] = useState(0);
  const [pendingRemoval, setPendingRemoval] = useState<LinuxGroupMember | null>(
    null,
  );

  const trimmedGroupName = groupName.trim();

  const { data: groupsData } = useQuery({
    queryKey: linuxGroupQueryKeys.list(),
    queryFn: () => getLinuxGroups({ size: 50 }),
    placeholderData: (prev) => prev,
  });
  const groups = useMemo(() => groupsData?.items ?? [], [groupsData]);

  const matchedGroup = groups.find((g) => g.name === trimmedGroupName);

  /**
   * Options for the group field. Once the input holds a group name exactly,
   * every group is offered again -- narrowing to the single exact match would
   * leave the admin unable to switch to a different group without first
   * clearing the field. Combobox is set to `autoComplete="none"` so this is
   * the only filter applied; its default mode would filter `items` a second
   * time against the input value and re-introduce that dead end.
   */
  const groupOptions = useMemo(() => {
    const keyword = trimmedGroupName.toLowerCase();
    if (!keyword || matchedGroup) return groups;

    return groups.filter((g) => g.name.toLowerCase().includes(keyword));
  }, [groups, matchedGroup, trimmedGroupName]);
  const isGroupNameValid =
    !trimmedGroupName || isValidLinuxGroupName(trimmedGroupName);

  const {
    data: membersData,
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = useQuery({
    queryKey: linuxGroupQueryKeys.memberPage(trimmedGroupName, memberPage),
    queryFn: () =>
      getLinuxGroupMembers({ name: trimmedGroupName, page: memberPage }),
    enabled: !!matchedGroup,
    placeholderData: (prev) => prev,
  });

  const members = membersData?.items ?? [];
  const totalMemberPages = membersData?.totalPages ?? 1;

  /**
   * Keeps only the rows the backend rejected and pins each error onto its row,
   * so the admin can correct them in place instead of retyping the whole batch.
   */
  const syncFailureState = (result: AddLinuxGroupMembersResult) => {
    const errorMap = new Map(result.errors.map((e) => [e.member, e.message]));

    setRows((prev) => {
      const failed = prev
        .filter((r) => errorMap.has(r.id.trim()))
        .map((r) => ({ ...r, error: errorMap.get(r.id.trim()) }));

      return failed.length > 0 ? failed : [emptyRow()];
    });
  };

  const addMembers = useMutation({
    mutationFn: (request: AddLinuxGroupMembersRequest) =>
      addLinuxGroupMembers(request),
    onMutate: () => {
      const toastId = "add-linux-group-members";
      toast.loading(t("common.updating"), { id: toastId });
      return toastId;
    },
    onSuccess: (result, variables, ctx) => {
      const total = variables.members.length;

      if (result.addedFailureNumber === 0) {
        toast.success(
          t("linuxGroupConfig.toastAllSuccess", {
            success: result.addedSuccessNumber,
            total,
            group: variables.name,
          }),
          { id: ctx },
        );
        setRows([emptyRow()]);
      } else {
        toast.error(
          t("linuxGroupConfig.toastPartialSuccess", {
            success: result.addedSuccessNumber,
            total,
            fail: result.addedFailureNumber,
          }),
          { id: ctx },
        );
        syncFailureState(result);
      }

      setMemberPage(0);
      queryClient.invalidateQueries({ queryKey: linuxGroupQueryKeys.all });
    },
    onError: (err, _variables, ctx) => {
      toast.error(getErrMessage(err, t("linuxGroupConfig.toastAddFail")), {
        id: ctx,
      });
    },
  });

  const removeMember = useMutation({
    mutationFn: (request: RemoveLinuxGroupMemberRequest) =>
      removeLinuxGroupMember(request),
    onMutate: ({ memberId }) => {
      const toastId = `remove-linux-group-member-${memberId}`;
      toast.loading(t("common.removing"), { id: toastId });
      return toastId;
    },
    onSuccess: (_data, _variables, ctx) => {
      toast.success(t("linuxGroupConfig.toastRemoveSuccess"), { id: ctx });
      queryClient.invalidateQueries({ queryKey: linuxGroupQueryKeys.all });
    },
    onError: (err, _variables, ctx) => {
      toast.error(getErrMessage(err, t("linuxGroupConfig.toastRemoveFail")), {
        id: ctx,
      });
    },
  });

  const updateRow = useCallback(
    (rowId: string, value: string) =>
      setRows((prev) =>
        prev.map((r) =>
          r.rowId === rowId ? { ...r, id: value, error: undefined } : r,
        ),
      ),
    [],
  );

  const addRow = useCallback(
    () => setRows((prev) => [...prev, emptyRow()]),
    [],
  );

  const removeRow = useCallback(
    (rowId: string) =>
      setRows((prev) => {
        const next = prev.filter((r) => r.rowId !== rowId);
        return next.length === 0 ? [emptyRow()] : next;
      }),
    [],
  );

  /**
   * Fills the blank rows with a pasted batch first, then appends the rest, so
   * pasting a column of ids from a spreadsheet fills the form in one go.
   */
  const addBatch = useCallback(
    (ids: string[]) =>
      setRows((prev) => {
        const next = [...prev];
        let batchIndex = 0;

        for (let i = 0; i < next.length && batchIndex < ids.length; i++) {
          if (!next[i].id.trim()) {
            next[i] = { ...next[i], id: ids[batchIndex++], error: undefined };
          }
        }

        while (batchIndex < ids.length) {
          next.push({ rowId: crypto.randomUUID(), id: ids[batchIndex++] });
        }

        return next;
      }),
    [],
  );

  const hasEmptyId = rows.some((r) => !r.id.trim());
  const hasDuplicate = rows.some(
    (r, i) => rows.findIndex((o) => o.id.trim() === r.id.trim()) !== i,
  );

  const canSave =
    !!trimmedGroupName &&
    isGroupNameValid &&
    !hasEmptyId &&
    !hasDuplicate &&
    !addMembers.isPending;

  const handleSave = () =>
    addMembers.mutate({
      name: trimmedGroupName,
      members: rows.map((r) => r.id.trim()),
    });

  const handleConfirmRemove = () => {
    if (!pendingRemoval) return;
    removeMember.mutate({
      name: trimmedGroupName,
      memberId: pendingRemoval.id,
    });
    setPendingRemoval(null);
  };

  const memberColumns = useMemo(
    () => getMemberColumns({ t, onRemove: setPendingRemoval }),
    [t],
  );

  const rowViews = useMemo<UserRowView[]>(
    () =>
      rows.map((row, index) => ({
        ...row,
        isDuplicate:
          !!row.id.trim() &&
          rows.filter((other) => other.id.trim() === row.id.trim()).length > 1,
        isLast: index === rows.length - 1,
      })),
    [rows],
  );

  const userRowColumns = useMemo(
    () =>
      getUserRowColumns({
        t,
        disabled: addMembers.isPending,
        onChange: updateRow,
        onAddBatch: addBatch,
        onRemove: removeRow,
        onAdd: addRow,
      }),
    [t, addMembers.isPending, updateRow, addBatch, removeRow, addRow],
  );

  const groupHint = () => {
    if (!trimmedGroupName) return t("linuxGroupConfig.groupNameHint");
    if (!isGroupNameValid) return t("linuxGroupConfig.groupNameInvalid");
    if (matchedGroup)
      return t("linuxGroupConfig.groupExists", {
        gid: matchedGroup.gid,
        count: matchedGroup.memberCount,
      });
    return t("linuxGroupConfig.groupWillBeCreated", {
      group: trimmedGroupName,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="py-4 sm:py-6">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>{t("linuxGroupConfig.addCardTitle")}</CardTitle>
          <CardDescription>
            {t("linuxGroupConfig.addCardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-4 sm:px-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="linux-group-name">
              {t("linuxGroupConfig.groupNameLabel")}
            </Label>
            <div className="max-w-sm">
              <Combobox items={groupOptions} autoComplete="none">
                <ComboboxInput
                  id="linux-group-name"
                  value={groupName}
                  placeholder={t("linuxGroupConfig.groupNamePlaceholder")}
                  disabled={addMembers.isPending}
                  className={cn(
                    "h-10 w-full text-sm",
                    !isGroupNameValid && "border-red-500 bg-red-50",
                  )}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setMemberPage(0);
                  }}
                />
                <ComboboxContent>
                  <ComboboxEmpty>
                    {t("linuxGroupConfig.noGroupFound")}
                  </ComboboxEmpty>
                  {groupOptions.length > 0 && (
                    <ComboboxList>
                      {(group) => (
                        <ComboboxItem
                          key={group.name}
                          value={group.name}
                          onClick={() => {
                            setGroupName(group.name);
                            setMemberPage(0);
                          }}
                        >
                          <span className="font-mono">{group.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {t("linuxGroupConfig.memberCount", {
                              count: group.memberCount,
                            })}
                          </span>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  )}
                </ComboboxContent>
              </Combobox>
            </div>
            <p
              className={cn(
                "text-muted-foreground text-xs",
                !isGroupNameValid && "text-red-500",
              )}
            >
              {groupHint()}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("linuxGroupConfig.usersLabel")}</Label>
            <div className="overflow-x-auto">
              <DataTable
                columns={userRowColumns}
                data={rowViews}
                getRowId={(row) => row.rowId}
                rowClassName="hover:bg-muted"
              />
            </div>
            {hasDuplicate && (
              <p className="text-xs text-red-500">
                {t("linuxGroupConfig.duplicateEntry")}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!canSave}>
              {addMembers.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {t("linuxGroupConfig.addToGroup")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {matchedGroup && (
        <Card className="py-4 sm:py-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex flex-wrap items-center gap-2">
              <span className="font-mono">{matchedGroup.name}</span>
              <Badge variant="secondary">GID {matchedGroup.gid}</Badge>
            </CardTitle>
            <CardDescription>
              {t("linuxGroupConfig.membersCardDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="overflow-x-auto">
              <DataTable
                columns={memberColumns}
                data={members}
                isLoading={isLoadingMembers}
                isError={isMembersError}
                loadingMessage={t("linuxGroupConfig.loadingMembers")}
                errorMessage={t("linuxGroupConfig.failedToLoadMembers")}
                emptyMessage={t("linuxGroupConfig.noMembers")}
                getRowId={(member) => member.id}
                rowClassName="hover:bg-muted"
              />
            </div>

            {!isLoadingMembers && !isMembersError && members.length > 0 && (
              <div className="mt-6 flex justify-center">
                <PaginationControls
                  currentPage={memberPage}
                  totalPages={totalMemberPages}
                  setCurrentPage={setMemberPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!pendingRemoval}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("linuxGroupConfig.removeConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("linuxGroupConfig.removeConfirmDescription", {
                user: pendingRemoval?.userIdentifier ?? "",
                group: trimmedGroupName,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmRemove}
            >
              {t("common.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
