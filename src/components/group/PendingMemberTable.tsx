import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import PendingMemberRow from "@/components/group/PendingMemberRow";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGetPendingMembers } from "@/hooks/useGetPendingMembers";
import { useUpdatePendingMember } from "@/hooks/useUpdatePendingMember";
import { useRemovePendingMember } from "@/hooks/useRemovePendingMember";
import { useTranslation } from "react-i18next";
import type { GroupRoleAccessLevel, GroupMemberRoleName } from "@/types/group";
import { GlobalRole } from "@/lib/permission";
import { AccessLevelUser } from "@/types/group";
import { Loader2 } from "lucide-react";
import PaginationControls from "@/components/PaginationControl";
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

  const maxVisiblePages = 4;
  let startPage = Math.max(currentPage - 1, 0);
  let endPage = startPage + maxVisiblePages - 1;
  if (endPage >= totalPages) {
    endPage = totalPages - 1;
    startPage = Math.max(endPage - maxVisiblePages + 1, 0);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {t("groupPages.pendingMembers.pendingMember")}
          </h3>
        </div>

        {isLoading ? (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("groupComponents.groupMemberTable.loadingMembers")}
          </div>
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
                    {t("groupComponents.groupMemberTable.studentIdOrEmail")}
                  </TableHead>
                  <TableHead>
                    {t("groupComponents.groupMemberTable.role")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => {
                  return (
                    <PendingMemberRow
                      key={m.id}
                      id={m.userIdentifier}
                      email={m.userIdentifier}
                      role={m.role.roleName as GroupMemberRoleName}
                      accessLevel={accessLevel}
                      globalRole={effectiveGlobalRole}
                      showActions={canEditMembers}
                      isArchived={isArchived}
                      onDelete={() => handleRemove(m.id)}
                      onUpdateRole={(newRoleId) =>
                        handleUpdateRole(m.id, newRoleId)
                      }
                    />
                  );
                })}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-center">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
