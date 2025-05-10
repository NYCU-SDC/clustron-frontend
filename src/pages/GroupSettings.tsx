import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useState, useMemo, useEffect } from "react";
import type { Member } from "@/lib/mockGroups";
import { useGroupContext } from "@/context/GroupContext";
import { useUserContext } from "@/context/UserContext";
import {
  canAddMember,
  canRemoveMember,
  canArchiveGroup,
} from "@/lib/permission";

export type GroupContextType = {
  groupId: string;
};

export default function GroupSettings() {
  const { groupId } = useOutletContext<GroupContextType>();
  const { groups, setGroups } = useGroupContext();
  const { user } = useUserContext(); // 🔑 取得目前登入使用者
  if (!user) return <div>User not logged in.</div>;
  const isAdmin = user.accessLevel === "admin";
  const group = useMemo(
    () => groups.find((g) => g.id === groupId),
    [groups, groupId],
  );

  const [isArchived, setIsArchived] = useState(group?.isArchived ?? false);
  const [members, setMembers] = useState<Member[]>(group?.members ?? []);

  useEffect(() => {
    if (group) {
      setIsArchived(group.isArchived);
      setMembers(group.members);
    }
  }, [group]);

  if (!group || !user) return <div>Group not found or user not logged in.</div>;
  const courseLevel = group.members.find(
    (m) => m.studentId === user.studentId,
  )?.accessLevel;
  const canEdit =
    isAdmin || (courseLevel ? canRemoveMember(courseLevel) : false);
  const canToggleArchive =
    isAdmin || (courseLevel ? canArchiveGroup(courseLevel) : false);
  const canAdd = isAdmin || (courseLevel ? canAddMember(courseLevel) : false);

  const handleRemove = (index: number) => {
    const target = members[index];
    setMembers((prev) => prev.filter((_, i) => i !== index));

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? { ...g, members: g.members.filter((m) => m.id !== target.id) }
          : g,
      ),
    );
  };

  const toggleArchive = () => {
    const next = !isArchived;
    setIsArchived(next);

    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, isArchived: next } : g)),
    );
  };

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable
        members={members}
        groupId={group.id}
        isArchived={isArchived}
        onRemove={canEdit && !isArchived ? handleRemove : undefined}
        showAddButton={canAdd}
        showActions={canEdit}
      />

      {canToggleArchive && (
        <div className="mt-10 p-4 border rounded bg-gray-50">
          <h2 className="font-bold text-lg mb-2">
            {isArchived ? "Unarchive This Group" : "Archive This Group"}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {isArchived
              ? "This will reactivate the group and allow updates again."
              : "This will turn the group into archive state, no update can be made before it is activated again."}
          </p>
          <button
            onClick={toggleArchive}
            className="bg-gray-900 text-white px-4 py-2 rounded"
          >
            {isArchived ? "Unarchive" : "Archive"}
          </button>
        </div>
      )}
    </>
  );
}
