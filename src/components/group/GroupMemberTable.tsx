import { useInfiniteMembers } from "@/hooks/useGetMembers";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import GroupMemberRow from "@/components/group/GroupMemberRow";
import AddMemberButton from "@/components/group/AddMemberButton";
import { Card, CardContent } from "@/components/ui/card";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { GlobalRole, GroupRoleAccessLevel } from "@/lib/permission";
import { AccessLevelUser, type GroupMemberRoleName } from "@/types/group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button.tsx";

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
  const { canEditMembers } = useGroupPermissions(
    accessLevel,
    effectiveGlobalRole,
  );
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteMembers(groupId);

  const members = data?.pages.flatMap((page) => page.items) ?? [];

  const queryClient = useQueryClient();
  const { mutate: updateMember } = useUpdateMember(groupId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", groupId] });
    },
  });

  const { roleNameToId } = useRoleMapper();

  const updateMemberRole = (memberId: string, newRole: GroupMemberRoleName) => {
    const roleId = roleNameToId(newRole);
    if (!roleId) {
      console.error(`Invalid role name: ${newRole}`);
      return;
    }

    updateMember({
      memberId,
      roleId,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{t("groupComponents.groupMemberTable.members")}</h3>
          {canEditMembers && !isOverview && (
            <AddMemberButton groupId={groupId} isArchived={isArchived} />
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">
            {t("groupComponents.groupMemberTable.loadingMembers")}
          </p>
        ) : isError ? (
          <p className="text-sm text-red-500">
            {t("groupComponents.groupMemberTable.failedToLoadMembers")}
          </p>
        ) : members.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t("groupComponents.groupMemberTable.noMembersFound")}
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("groupComponents.groupMemberTable.name")}
                  </TableHead>
                  <TableHead>
                    {t("groupComponents.groupMemberTable.studentIdOrEmail")}
                  </TableHead>
                  <TableHead>
                    {t("groupComponents.groupMemberTable.role")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <GroupMemberRow
                    key={m.id}
                    name={m.username}
                    id={m.studentId}
                    email={m.email}
                    role={m.role.Role as GroupMemberRoleName}
                    accessLevel={accessLevel}
                    showActions={canEditMembers && !isOverview}
                    isArchived={isArchived}
                    onDelete={onRemove ? () => onRemove(m.id) : undefined}
                    onUpdateRole={(newRole) => updateMemberRole(m.id, newRole)}
                  />
                ))}
              </TableBody>
            </Table>

            {hasNextPage && (
              <div className="mt-4 w-full flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isFetchingNextPage
                    ? t("groupComponents.groupMemberTable.loadingMore")
                    : t("groupComponents.groupMemberTable.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
