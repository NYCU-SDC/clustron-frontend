import GroupMemberRow from "@/components/group/GroupMemberRow";
import AddMemberButton from "@/components/group/AddMemberButton";
import { Card, CardContent } from "@/components/ui/card";
import type { Member } from "@/lib/mockGroups";
type Props = {
  members: Member[];
  showActions?: boolean;
  showAddButton?: boolean;
  groupId?: string;
  onRemove?: (index: number) => void;
  isArchived?: boolean; // ✅ 新增
};

export default function GroupMemberTable({
  members,
  showActions = true,
  showAddButton = false,
  groupId,
  onRemove,
  isArchived = false, //
}: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Members</h3>
          {groupId && (
            <AddMemberButton groupId={groupId} isArchived={isArchived} />
          )}
        </div>

        <table className="w-full text-left text-sm border-t border-gray-200">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2">Name</th>
              <th className="py-2">Student ID or Email</th>
              <th className="py-2">Department</th>
              <th className="py-2">Role</th>
              {showActions && (
                <th className="py-2 text-right">Server Access</th>
              )}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <GroupMemberRow
                key={m.id}
                name={m.username}
                id={m.studentId}
                email={m.email}
                dept={m.dept}
                role={m.role}
                showActions={showActions}
                onDelete={onRemove ? () => onRemove(i) : undefined}
                isArchived={isArchived} //
              />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
