import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import PaginationControls from "@/components/PaginationControls";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGetMembers } from "@/hooks/useGetMembers";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import AddMemberButton from "@/components/group/AddMemberButton";
import GroupMemberRow from "@/components/group/GroupMemberRow";

import type { GlobalRole, GroupRoleAccessLevel } from "@/lib/permission";
import { AccessLevelUser, type GroupMemberRoleName } from "@/types/group";

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

  // const maxPages = 4;
  // let startPage = Math.max(currentPage - 1, 0);
  // let endPage = startPage + maxPages - 1;
  // if (endPage >= totalPages) {
  //   endPage = totalPages - 1;
  //   startPage = Math.max(endPage - maxPages + 1, 0);
  // }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {t("groupComponents.groupMemberTable.members")}
          </h3>
          {canEditMembers && !isOverview && (
            <AddMemberButton groupId={groupId} isArchived={isArchived} />
          )}
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
                    name={m.fullName}
                    id={m.studentId}
                    email={m.email}
                    globalRole={effectiveGlobalRole}
                    role={m.role?.roleName as GroupMemberRoleName}
                    accessLevel={accessLevel}
                    showActions={canEditMembers && !isOverview}
                    isArchived={isArchived}
                    isPending={isUpdatingMember}
                    onDelete={onRemove ? () => onRemove(m.id) : undefined}
                    onUpdateRole={(newRoleId) =>
                      updateMemberRole(m.id, newRoleId)
                    }
                  />
                ))}
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
