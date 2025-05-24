import { useInfiniteMembers } from "@/hooks/useGetMembers";
import GroupMemberRow from "@/components/group/GroupMemberRow";
import AddMemberButton from "@/components/group/AddMemberButton";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  showActions?: boolean;
  showAddButton?: boolean;
  groupId: string;
  onRemove?: (memberId: string) => void;
  isArchived?: boolean;
};

export default function GroupMemberTable({
  showActions = true,
  groupId,
  onRemove,
  isArchived = false,
}: Props) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteMembers(groupId);

  const members = data?.pages.flatMap((page) => page.items) ?? [];
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Members</h3>
          {showActions && groupId && (
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
            <table className="w-full text-left text-sm border-t border-gray-200">
              <thead>
                <tr className="text-gray-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Student ID or Email</th>
                  <th className="py-2">Role</th>
                  {showActions && <th className="py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <GroupMemberRow
                    key={m.id}
                    name={m.username || "-"}
                    id={m.studentId || m.email || "-"}
                    email={m.email || "-"}
                    role={m.role.role}
                    showActions={showActions}
                    onDelete={onRemove ? () => onRemove(m.id) : undefined}
                    isArchived={isArchived}
                  />
                ))}
              </tbody>
            </table>

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
