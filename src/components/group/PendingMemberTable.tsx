import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PendingMemberRow from "@/components/group/PendingMemberRow";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGetPendingMembers } from "@/hooks/useGetPendingMembers";
import { useUpdatePendingMember } from "@/hooks/useUpdatePendingMember";
import { useRemovePendingMember } from "@/hooks/useRemovePendingMember";
import { useTranslation } from "react-i18next";
import type {
  GlobalRole,
  GroupRoleAccessLevel,
  GroupMemberRoleName,
} from "@/types/group";
import { AccessLevelUser } from "@/types/group";
import { Loader2 } from "lucide-react";
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
  const { canEditMembers } = useGroupPermissions(
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
          <h3 className="font-bold text-lg">{t("groupPages.pendingMember")}</h3>
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
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                      className={
                        currentPage === 0
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {startPage > 0 && (
                    <PaginationItem>
                      <span className="px-2">...</span>
                    </PaginationItem>
                  )}

                  {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, i) => startPage + i,
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {endPage < totalPages - 1 && (
                    <PaginationItem>
                      <span className="px-2">...</span>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                      }
                      className={
                        currentPage === totalPages - 1
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
