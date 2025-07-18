import { useState, useMemo } from "react";
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
import PendingRow from "@/components/group/PendingMemberRow";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { useGetPendingMembers } from "@/hooks/useGetPendingMembers";
import { useUpdatePendingMember } from "@/hooks/useUpdatePendingMember";
import { useRemovePendingMember } from "@/hooks/useRemovePendingMember";

import type {
  GlobalRole,
  GroupRoleAccessLevel,
  GroupMemberRoleName,
} from "@/types/group";
import { AccessLevelUser } from "@/types/group";

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
  const { data, isLoading, isError } = useGetPendingMembers(groupId);
  const { mutate: updatePendingMember } = useUpdatePendingMember(groupId);
  const { mutate: removePendingMember } = useRemovePendingMember(groupId);
  const { roleNameToId } = useRoleMapper();
  const members = data?.items ?? [];
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(members.length / pageSize));

  const pagedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return members.slice(start, start + pageSize);
  }, [members, currentPage]);

  const handleUpdateRole = (
    pendingId: string,
    newRole: GroupMemberRoleName,
  ) => {
    const roleId = roleNameToId(newRole);

    if (!roleId) {
      console.error("fail to  find role:");
      return;
    }

    updatePendingMember({
      id: groupId,
      pendingId,
      roleId,
    });
  };

  const handleRemove = (pendingId: string) => {
    removePendingMember({ id: groupId, pendingId });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Pending Members</h3>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading members...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Failed to load members.</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-gray-500">No pending members found.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID or Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedMembers.map((m) => {
                  console.log("👀 pending member row data:", m);
                  return (
                    <PendingRow
                      key={m.id}
                      id={m.userIdentifier}
                      email={m.userIdentifier}
                      role={m.role.Role as GroupMemberRoleName}
                      accessLevel={accessLevel}
                      showActions={canEditMembers}
                      isArchived={isArchived}
                      onDelete={() => handleRemove(m.id)}
                      onUpdateRole={(newRole) =>
                        handleUpdateRole(m.id, newRole)
                      }
                      roleId={m.role.ID}
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
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
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
