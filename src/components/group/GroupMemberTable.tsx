import { useInfiniteMembers } from "@/hooks/useGetMembers";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import GroupMemberRow from "@/components/group/GroupMemberRow";
import AddMemberButton from "@/components/group/AddMemberButton";
import { Card, CardContent } from "@/components/ui/card";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { useQueryClient } from "@tanstack/react-query";

import type { GlobalRole, GroupRoleAccessLevel } from "@/lib/permission";
import { AccessLevelUser, type GroupMemberRoleName } from "@/types/group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";

type Props = {
  groupId: string;
  accessLevel?: GroupRoleAccessLevel;
  globalRole?: GlobalRole;
  onRemove?: (memberId: string) => void;
  isArchived?: boolean;
};

export default function GroupMemberTable({
  groupId,
  accessLevel = AccessLevelUser,
  globalRole,
  onRemove,
  isArchived = false,
}: Props) {
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
      queryClient.invalidateQueries({ queryKey: ["members", groupId] }); // 🔁 自動重新抓資料
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
          <h3 className="font-bold text-lg">Members</h3>
          {canEditMembers && (
            <AddMemberButton groupId={groupId} isArchived={isArchived} />
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading members...</p>
        ) : isError ? (
          <p className="text-sm text-red-500">Failed to load members.</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-gray-500">No members found.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID or Email</TableHead>
                  <TableHead>Role</TableHead>
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
                    showActions={canEditMembers}
                    isArchived={isArchived}
                    onDelete={onRemove ? () => onRemove(m.id) : undefined}
                    onUpdateRole={(newRole) => updateMemberRole(m.id, newRole)}
                  />
                ))}
              </TableBody>
            </Table>

            {hasNextPage && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
