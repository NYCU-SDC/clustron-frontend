import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DataTable,
  createDataTableColumnHelper,
  type DataTableColumns,
} from "@/components/ui/data-table";
import PaginationControls from "@/components/customUI/PaginationControl";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGetMembers } from "@/hooks/useGetMembers";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import AddMemberButton from "@/components/group/AddMemberButton";
import MemberDeleteMenu from "@/components/group/MemberDeleteMenu";
import MemberDetailDrawer from "@/components/group/MemberDetailDrawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { GlobalRole, GroupRoleAccessLevel } from "@/lib/permission";
import { AccessLevelOwner, AccessLevelUser } from "@/types/group";
import type { GroupMember } from "@/types/group";

const helper = createDataTableColumnHelper<GroupMember>();

// The role a member is shown as: LDAP-only members have no group role to show.
function useDisplayRoleLabel(member: GroupMember) {
  const { t } = useTranslation();
  const { roles } = useRoleMapper();

  const roleName = member.role.roleName;
  const currentRole = roles.find((r) => r.roleName === roleName);
  const currentRoleLabel = currentRole?.roleName || roleName || "";

  return member.onlyInLDAP
    ? t("groupComponents.groupMemberTable.onlyInLDAP")
    : currentRoleLabel;
}

function MemberRoleCell({
  member,
  globalRole,
  accessLevel,
  canUpdate,
  isPending,
  onUpdateRole,
}: {
  member: GroupMember;
  globalRole: GlobalRole;
  accessLevel: GroupRoleAccessLevel;
  canUpdate: boolean;
  isPending: boolean;
  onUpdateRole: (newRoleId: string) => void;
}) {
  const { getRolesByAccessLevel } = useRoleMapper();
  const displayRoleLabel = useDisplayRoleLabel(member);

  if (!canUpdate) {
    return <span>{displayRoleLabel}</span>;
  }

  if (isPending) {
    return (
      <div className="flex items-center text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Updating...
      </div>
    );
  }

  const effectiveAccessLevel =
    globalRole === "admin" ? AccessLevelOwner : accessLevel;
  const assignableRoles = getRolesByAccessLevel(effectiveAccessLevel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 font-medium text-sm px-2 py-1 hover:bg-muted"
        >
          {displayRoleLabel}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {assignableRoles.map((r) => (
          <DropdownMenuItem
            key={r.id}
            onClick={() => onUpdateRole(r.id)}
            disabled={r.roleName === member.role.roleName}
          >
            {r.roleName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MemberActionsCell({
  member,
  showActions,
  isArchived,
  onDelete,
}: {
  member: GroupMember;
  showActions: boolean;
  isArchived: boolean;
  onDelete?: () => void;
}) {
  const displayRoleLabel = useDisplayRoleLabel(member);

  if (!showActions) {
    // Overview mode — mobile only, view-only member details (no delete).
    return (
      <div className="sm:hidden">
        <MemberDetailDrawer
          name={member.fullName}
          email={member.email}
          studentId={member.studentId}
          role={displayRoleLabel}
        />
      </div>
    );
  }

  return (
    <>
      {/* Desktop: dropdown menu */}
      <div className="hidden sm:block">
        <MemberDeleteMenu
          onConfirm={() => onDelete?.()}
          isArchived={isArchived}
        />
      </div>
      {/* Mobile: bottom drawer with member details */}
      <div className="sm:hidden">
        <MemberDetailDrawer
          name={member.fullName}
          email={member.email}
          studentId={member.studentId}
          role={displayRoleLabel}
          onDelete={onDelete}
          isArchived={isArchived}
        />
      </div>
    </>
  );
}

function getColumns({
  t,
  globalRole,
  accessLevel,
  showActions,
  showDetail,
  isArchived,
  isPending,
  onRemove,
  onUpdateRole,
}: {
  t: TFunction;
  globalRole: GlobalRole;
  accessLevel: GroupRoleAccessLevel;
  showActions: boolean;
  showDetail: boolean;
  isArchived: boolean;
  isPending: boolean;
  onRemove?: (memberId: string) => void;
  onUpdateRole: (memberId: string, newRoleId: string) => void;
}) {
  const columns: DataTableColumns<GroupMember> = [
    helper.accessor("fullName", {
      header: t("groupComponents.groupMemberTable.name"),
      meta: { cellClassName: "hidden sm:table-cell" },
    }),
    helper.display({
      id: "identity",
      header: t("groupComponents.groupMemberTable.studentIdOrEmail"),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium sm:hidden">{row.original.fullName}</span>
          <span className="font-medium hidden sm:inline">
            {row.original.studentId}
          </span>
          <span className="text-muted-foreground text-xs">
            {row.original.email}
          </span>
        </div>
      ),
    }),
    helper.display({
      id: "role",
      header: t("groupComponents.groupMemberTable.role"),
      cell: ({ row }) => (
        <MemberRoleCell
          member={row.original}
          globalRole={globalRole}
          accessLevel={accessLevel}
          canUpdate={
            showActions &&
            !isArchived &&
            !row.original.onlyInLDAP &&
            row.original.role.roleName !== "group_owner"
          }
          isPending={isPending}
          onUpdateRole={(newRoleId) => onUpdateRole(row.original.id, newRoleId)}
        />
      ),
    }),
  ];

  if (showActions || showDetail) {
    columns.push(
      helper.display({
        id: "actions",
        header: "",
        meta: { cellClassName: "text-right pr-4" },
        cell: ({ row }) => (
          <MemberActionsCell
            member={row.original}
            showActions={showActions}
            isArchived={isArchived}
            onDelete={onRemove ? () => onRemove(row.original.id) : undefined}
          />
        ),
      }),
    );
  }

  return columns;
}

type Props = {
  groupId: string;
  accessLevel?: GroupRoleAccessLevel;
  globalRole?: GlobalRole;
  onRemove?: (memberId: string) => void;
  isArchived?: boolean;
  isOverview?: boolean;
};

export default function GroupMemberTable({
  groupId,
  accessLevel = AccessLevelUser,
  globalRole,
  onRemove,
  isArchived = false,
  isOverview = false,
}: Props) {
  const { t } = useTranslation();
  const payload = useJwtPayload();
  const effectiveGlobalRole = globalRole ?? (payload?.Role as GlobalRole);
  const { canEditMembers } = getGroupPermissions(
    accessLevel,
    effectiveGlobalRole,
  );
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, isError } = useGetMembers(groupId, currentPage);
  const members = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember(groupId);

  const updateMemberRole = (memberId: string, newRoldId: string) => {
    if (!newRoldId) {
      console.error(`Invalid role `);
      return;
    }

    updateMember({
      memberId: memberId,
      groupId: groupId,
      roleId: newRoldId,
    });
  };

  const showActions = canEditMembers && !isOverview;

  const columns = useMemo(
    () =>
      getColumns({
        t,
        globalRole: effectiveGlobalRole,
        accessLevel,
        showActions,
        showDetail: isOverview,
        isArchived,
        isPending: isUpdatingMember,
        onRemove,
        onUpdateRole: updateMemberRole,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      effectiveGlobalRole,
      accessLevel,
      showActions,
      isOverview,
      isArchived,
      isUpdatingMember,
      onRemove,
      groupId,
    ],
  );

  return (
    <Card className="py-4 sm:py-6">
      <CardContent className="px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-bold text-lg">
            {t("groupComponents.groupMemberTable.members")}
          </h3>
          {canEditMembers && !isOverview && (
            <AddMemberButton groupId={groupId} isArchived={isArchived} />
          )}
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={members}
            isLoading={isLoading}
            isError={isError}
            loadingMessage={t(
              "groupComponents.groupMemberTable.loadingMembers",
            )}
            errorMessage={t(
              "groupComponents.groupMemberTable.failedToLoadMembers",
            )}
            emptyMessage={t("groupComponents.groupMemberTable.noMembersFound")}
            getRowId={(member) => member.id}
            headerClassName="hidden sm:table-header-group"
            rowClassName={cn(
              "hover:bg-muted transition-opacity",
              isUpdatingMember && "opacity-50 cursor-wait",
            )}
          />
        </div>

        {!isLoading && !isError && members.length > 0 && (
          <div className="mt-6 flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
