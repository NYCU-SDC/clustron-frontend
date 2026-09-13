import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DataTable,
  createDataTableColumnHelper,
  type DataTableColumns,
} from "@/components/ui/data-table";
import MemberDeleteMenu from "@/components/group/MemberDeleteMenu";
import MemberDetailDrawer from "@/components/group/MemberDetailDrawer";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGetPendingMembers } from "@/hooks/useGetPendingMembers";
import { useUpdatePendingMember } from "@/hooks/useUpdatePendingMember";
import { useRemovePendingMember } from "@/hooks/useRemovePendingMember";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { GroupRoleAccessLevel, PendingMember } from "@/types/group";
import { GlobalRole } from "@/lib/permission";
import { AccessLevelOwner, AccessLevelUser } from "@/types/group";
import { ChevronDown } from "lucide-react";
import PaginationControls from "@/components/customUI/PaginationControl";

const helper = createDataTableColumnHelper<PendingMember>();

function useRoleLabel(member: PendingMember) {
  const { roles } = useRoleMapper();
  const roleName = member.role.roleName;
  const currentRole = roles.find((r) => r.roleName === roleName);

  return currentRole?.roleName || roleName;
}

function PendingRoleCell({
  member,
  globalRole,
  accessLevel,
  canUpdate,
  onUpdateRole,
}: {
  member: PendingMember;
  globalRole: GlobalRole;
  accessLevel: GroupRoleAccessLevel;
  canUpdate: boolean;
  onUpdateRole: (newRoleId: string) => void;
}) {
  const { getRolesByAccessLevel } = useRoleMapper();
  const currentRoleLabel = useRoleLabel(member);

  if (!canUpdate) {
    return <span>{currentRoleLabel}</span>;
  }

  const effectiveAccessLevel =
    globalRole === "admin" ? AccessLevelOwner : accessLevel;
  const assignableRoles = getRolesByAccessLevel(effectiveAccessLevel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 cursor-pointer font-medium text-sm"
        >
          {currentRoleLabel}
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

function PendingActionsCell({
  member,
  isArchived,
  onDelete,
}: {
  member: PendingMember;
  isArchived: boolean;
  onDelete: () => void;
}) {
  const currentRoleLabel = useRoleLabel(member);

  return (
    <>
      {/* Desktop: dropdown menu */}
      <div className="hidden sm:block">
        <MemberDeleteMenu onConfirm={onDelete} isArchived={isArchived} />
      </div>
      {/* Mobile: bottom drawer with member details */}
      <div className="sm:hidden">
        <MemberDetailDrawer
          name={member.userIdentifier}
          email={member.userIdentifier}
          studentId={member.userIdentifier}
          role={currentRoleLabel}
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
  isArchived,
  onRemove,
  onUpdateRole,
}: {
  t: TFunction;
  globalRole: GlobalRole;
  accessLevel: GroupRoleAccessLevel;
  showActions: boolean;
  isArchived: boolean;
  onRemove: (pendingId: string) => void;
  onUpdateRole: (pendingId: string, newRoleId: string) => void;
}) {
  const columns: DataTableColumns<PendingMember> = [
    helper.accessor("userIdentifier", {
      header: t("groupComponents.groupMemberTable.studentIdOrEmail"),
      cell: ({ getValue }) => (
        <div className="flex flex-col">
          <span className="font-medium">{getValue()}</span>
          <span className="text-muted-foreground text-xs">{getValue()}</span>
        </div>
      ),
    }),
    helper.display({
      id: "role",
      header: t("groupComponents.groupMemberTable.role"),
      cell: ({ row }) => (
        <PendingRoleCell
          member={row.original}
          globalRole={globalRole}
          accessLevel={accessLevel}
          canUpdate={
            showActions &&
            !isArchived &&
            row.original.role.roleName !== "group_owner"
          }
          onUpdateRole={(newRoleId) => onUpdateRole(row.original.id, newRoleId)}
        />
      ),
    }),
  ];

  if (showActions) {
    columns.push(
      helper.display({
        id: "actions",
        header: "",
        meta: { cellClassName: "text-right pr-4" },
        cell: ({ row }) => (
          <PendingActionsCell
            member={row.original}
            isArchived={isArchived}
            onDelete={() => onRemove(row.original.id)}
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
  isArchived?: boolean;
};

export default function PendingMemberTable({
  groupId,
  accessLevel = AccessLevelUser,
  globalRole,
  isArchived = false,
}: Props) {
  const payload = useJwtPayload();
  const effectiveGlobalRole = globalRole ?? (payload?.Role as GlobalRole);
  const { canEditMembers } = getGroupPermissions(
    accessLevel,
    effectiveGlobalRole,
  );
  const { t } = useTranslation();
  const { mutate: updatePendingMember } = useUpdatePendingMember(groupId);
  const { mutate: removePendingMember } = useRemovePendingMember(groupId);
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading, isError } = useGetPendingMembers(
    groupId,
    currentPage,
  );
  const members = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleUpdateRole = (pendingId: string, newRoleId: string) => {
    if (!newRoleId) {
      console.error("fail to find role:");
      return;
    }

    updatePendingMember({
      id: groupId,
      pendingId,
      roleId: newRoleId,
    });
  };

  const handleRemove = (pendingId: string) => {
    removePendingMember({ id: groupId, pendingId });
  };

  const columns = useMemo(
    () =>
      getColumns({
        t,
        globalRole: effectiveGlobalRole,
        accessLevel,
        showActions: canEditMembers,
        isArchived,
        onRemove: handleRemove,
        onUpdateRole: handleUpdateRole,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, effectiveGlobalRole, accessLevel, canEditMembers, isArchived, groupId],
  );

  return (
    <Card className="py-4 sm:py-6">
      <CardContent className="px-4 sm:px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {t("groupPages.pendingMembers.pendingMember")}
          </h3>
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
            rowClassName="hover:bg-muted"
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
