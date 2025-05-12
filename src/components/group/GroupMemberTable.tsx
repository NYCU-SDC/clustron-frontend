import GroupMemberRow from "@/components/group/GroupMemberRow";
import AddMemberButton from "@/components/group/AddMemberButton";
import { Card, CardContent } from "@/components/ui/card";
import { useInfiniteMembers } from "@/api/mutations/useGetMembers";
import type { MemberResponse } from "@/api/groups/getMember";

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
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMembers(groupId);

  console.log("完整的分页数据:", data);

  // 打印每页的详细信息
  data?.pages.forEach((page, index) => {
    console.log(`第 ${index + 1} 页数据:`, page);
    console.log(`第 ${index + 1} 页有 ${page.items.length} 个成员`);
  });
  const members: MemberResponse[] =
    data?.pages.flatMap((page) => page.items) ?? [];

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
        ) : (
          <>
            <table className="w-full text-left text-sm border-t border-gray-200">
              <thead>
                <tr className="text-gray-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Student ID or Email</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <GroupMemberRow
                    key={m.id}
                    name={m.title}
                    id={m.id}
                    email={m.description}
                    dept={"N/A"}
                    role={m.me.role.role}
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
