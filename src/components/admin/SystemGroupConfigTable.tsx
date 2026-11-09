import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  addSystemGroupMember,
  deleteSystemGroup,
  getSystemGroupMembers,
  getSystemGroups,
  removeSystemGroupMember,
  systemGroupQueryKeys,
} from "@/lib/request/systemGroups";
import { getUsers } from "@/lib/request/getUsers";
import type { User } from "@/types/admin";
import type { SystemGroup, SystemGroupMember } from "@/types/systemGroup";
import RegisterSystemGroupDialog from "@/components/admin/RegisterSystemGroupDialog";
import { getErrMessage } from "@/lib/errors";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const memberHelper = createDataTableColumnHelper<SystemGroupMember>();

function getMemberColumns({
  t,
  onRemove,
}: {
  t: TFunction;
  onRemove: (member: SystemGroupMember) => void;
}): DataTableColumns<SystemGroupMember> {
  return [
    memberHelper.accessor("fullName", {
      header: t("systemGroupConfig.tableHeadName"),
      cell: ({ row, getValue }) => (
        <div className="flex flex-col">
          <span className="font-medium">{getValue()}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.email}
          </span>
        </div>
      ),
    }),
    memberHelper.accessor("addedAt", {
      header: t("systemGroupConfig.tableHeadAddedAt"),
      meta: {
        headClassName: "hidden sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(getValue()).toLocaleDateString()}
        </span>
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
          aria-label={t("systemGroupConfig.removeFromGroup")}
          onClick={() => onRemove(row.original)}
        >
          <Trash2 size={16} />
        </Button>
      ),
    }),
  ];
}

export default function SystemGroupConfigTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingRemoval, setPendingRemoval] =
    useState<SystemGroupMember | null>(null);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [pendingGroupDeletion, setPendingGroupDeletion] =
    useState<SystemGroup | null>(null);

  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    isError: isGroupsError,
  } = useQuery({
    queryKey: systemGroupQueryKeys.list(),
    queryFn: getSystemGroups,
  });

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const {
    data: members = [],
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = useQuery({
    queryKey: systemGroupQueryKeys.members(selectedGroupId),
    queryFn: () => getSystemGroupMembers(selectedGroupId),
    enabled: !!selectedGroupId,
  });

  const debouncedUserQuery = useDebouncedValue(userQuery);
  const {
    data: userResults,
    isLoading: isSearchingUsers,
    isError: isUserSearchError,
  } = useQuery({
    queryKey: ["users", "search", debouncedUserQuery],
    queryFn: () => getUsers({ search: debouncedUserQuery, size: 10 }),
    enabled: !!debouncedUserQuery,
    placeholderData: (prev) => prev,
  });
  const userSuggestions = useMemo(
    () => userResults?.items ?? [],
    [userResults],
  );

  const addMember = useMutation({
    mutationFn: (user: User) =>
      addSystemGroupMember({ groupId: selectedGroupId, userId: user.id }),
    onMutate: () => {
      const toastId = "add-system-group-member";
      toast.loading(t("common.updating"), { id: toastId });
      return toastId;
    },
    onSuccess: (_data, user, ctx) => {
      toast.success(
        t("systemGroupConfig.toastAddSuccess", {
          user: user.email,
          group: selectedGroup?.name ?? "",
        }),
        { id: ctx },
      );
      setSelectedUser(null);
      setUserQuery("");
      queryClient.invalidateQueries({
        queryKey: systemGroupQueryKeys.members(selectedGroupId),
      });
    },
    onError: (err, _user, ctx) => {
      const status = err instanceof Error ? err.name : "";
      let message: string;
      if (status === "409") {
        message = t("systemGroupConfig.toastAlreadyMember");
      } else if (status === "400") {
        message = t("systemGroupConfig.toastNoLdapAccount");
      } else {
        message = getErrMessage(err, t("systemGroupConfig.toastAddFail"));
      }
      toast.error(message, { id: ctx });
    },
  });

  const removeMember = useMutation({
    mutationFn: (member: SystemGroupMember) =>
      removeSystemGroupMember({
        groupId: selectedGroupId,
        userId: member.userId,
      }),
    onMutate: (member) => {
      const toastId = `remove-system-group-member-${member.userId}`;
      toast.loading(t("common.removing"), { id: toastId });
      return toastId;
    },
    onSuccess: (_data, _member, ctx) => {
      toast.success(t("systemGroupConfig.toastRemoveSuccess"), { id: ctx });
      queryClient.invalidateQueries({
        queryKey: systemGroupQueryKeys.members(selectedGroupId),
      });
    },
    onError: (err, _member, ctx) => {
      toast.error(getErrMessage(err, t("systemGroupConfig.toastRemoveFail")), {
        id: ctx,
      });
    },
  });

  const deleteGroup = useMutation({
    mutationFn: (group: SystemGroup) => deleteSystemGroup(group.id),
    onMutate: (group) => {
      const toastId = `delete-system-group-${group.id}`;
      toast.loading(t("common.deleting"), { id: toastId });
      return toastId;
    },
    onSuccess: (_data, group, ctx) => {
      toast.success(
        t("systemGroupConfig.toastDeleteGroupSuccess", { group: group.name }),
        { id: ctx },
      );
      if (group.id === selectedGroupId) setSelectedGroupId("");
      queryClient.invalidateQueries({ queryKey: systemGroupQueryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: systemGroupQueryKeys.candidates(),
      });
    },
    onError: (err, _group, ctx) => {
      toast.error(
        getErrMessage(err, t("systemGroupConfig.toastDeleteGroupFail")),
        { id: ctx },
      );
    },
  });

  const handleConfirmRemove = () => {
    if (!pendingRemoval) return;
    removeMember.mutate(pendingRemoval);
    setPendingRemoval(null);
  };

  const handleConfirmDeleteGroup = () => {
    if (!pendingGroupDeletion) return;
    deleteGroup.mutate(pendingGroupDeletion);
    setPendingGroupDeletion(null);
  };

  const memberColumns = useMemo(
    () => getMemberColumns({ t, onRemove: setPendingRemoval }),
    [t],
  );

  let userLookupHint = "";
  if (isUserSearchError) {
    userLookupHint = t("systemGroupConfig.userSearchFailed");
  } else if (
    debouncedUserQuery &&
    !isSearchingUsers &&
    userSuggestions.length === 0
  ) {
    userLookupHint = t("systemGroupConfig.noUserMatch");
  }

  const canAdd = !!selectedUser && !!selectedGroupId && !addMember.isPending;

  return (
    <div className="flex flex-col gap-6">
      <Card className="py-4 sm:py-6">
        <CardHeader className="flex flex-col gap-2 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("systemGroupConfig.selectCardTitle")}</CardTitle>
            <CardDescription>
              {t("systemGroupConfig.selectCardDescription")}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => setRegisterOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t("systemGroupConfig.registerGroup")}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-4 sm:px-6">
          <Label htmlFor="system-group-select">
            {t("systemGroupConfig.groupLabel")}
          </Label>
          <div className="max-w-sm">
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
              disabled={isLoadingGroups || isGroupsError || groups.length === 0}
            >
              <SelectTrigger id="system-group-select" className="w-full">
                <SelectValue
                  placeholder={t("systemGroupConfig.groupPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <span className="font-mono">{group.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · GID {group.gidNumber}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isGroupsError ? (
            <p className="text-xs text-red-500">
              {t("systemGroupConfig.failedToLoadGroups")}
            </p>
          ) : (
            !isLoadingGroups &&
            groups.length === 0 && (
              <p className="text-muted-foreground text-xs">
                {t("systemGroupConfig.noGroups")}
              </p>
            )
          )}
        </CardContent>
      </Card>

      {selectedGroup && (
        <Card className="py-4 sm:py-6">
          <CardHeader className="flex flex-col gap-2 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="flex flex-wrap items-center gap-2">
                <span className="font-mono">{selectedGroup.name}</span>
                <Badge variant="secondary">GID {selectedGroup.gidNumber}</Badge>
              </CardTitle>
              <CardDescription>
                {selectedGroup.description ||
                  t("systemGroupConfig.membersCardDescription")}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="shrink-0 text-red-600 hover:text-red-700"
              onClick={() => setPendingGroupDeletion(selectedGroup)}
            >
              <Trash2 className="h-4 w-4" />
              {t("systemGroupConfig.deleteGroup")}
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-4 sm:px-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="system-group-add-user">
                {t("systemGroupConfig.addUserLabel")}
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <Combobox items={userSuggestions} autoComplete="none">
                    <ComboboxInput
                      id="system-group-add-user"
                      showTrigger={false}
                      value={userQuery}
                      disabled={addMember.isPending}
                      placeholder={t("systemGroupConfig.userPlaceholder")}
                      className="h-10 w-full text-sm"
                      onChange={(e) => {
                        setUserQuery(e.target.value);
                        setSelectedUser(null);
                      }}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>
                        {t("systemGroupConfig.noUserMatch")}
                      </ComboboxEmpty>
                      {userSuggestions.length > 0 && (
                        <ComboboxList>
                          {(user: User) => (
                            <ComboboxItem
                              key={user.id}
                              value={user.studentId}
                              onClick={() => {
                                setSelectedUser(user);
                                setUserQuery(user.studentId);
                              }}
                            >
                              <span>{user.studentId}</span>
                              <span className="text-muted-foreground">
                                {user.email}
                              </span>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      )}
                    </ComboboxContent>
                  </Combobox>
                  {userLookupHint && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {userLookupHint}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => selectedUser && addMember.mutate(selectedUser)}
                  disabled={!canAdd}
                >
                  {addMember.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {t("systemGroupConfig.addToGroup")}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <DataTable
                columns={memberColumns}
                data={members}
                isLoading={isLoadingMembers}
                isError={isMembersError}
                loadingMessage={t("systemGroupConfig.loadingMembers")}
                errorMessage={t("systemGroupConfig.failedToLoadMembers")}
                emptyMessage={t("systemGroupConfig.noMembers")}
                getRowId={(member) => member.userId}
                rowClassName="hover:bg-muted"
              />
            </div>
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
              {t("systemGroupConfig.removeConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("systemGroupConfig.removeConfirmDescription", {
                user: pendingRemoval?.fullName ?? "",
                group: selectedGroup?.name ?? "",
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

      <AlertDialog
        open={!!pendingGroupDeletion}
        onOpenChange={(open) => !open && setPendingGroupDeletion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("systemGroupConfig.deleteGroupConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("systemGroupConfig.deleteGroupConfirmDescription", {
                group: pendingGroupDeletion?.name ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDeleteGroup}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RegisterSystemGroupDialog
        open={isRegisterOpen}
        onOpenChange={setRegisterOpen}
      />
    </div>
  );
}
