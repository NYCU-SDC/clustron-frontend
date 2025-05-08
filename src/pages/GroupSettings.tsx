// src/pages/GroupSettings.tsx
import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useState } from "react";
import type { Member, Group } from "@/lib/courseMock";
import { removeMemberFromGroup, mockGroups } from "@/lib/courseMock";

export type GroupContextType = {
  group: Group;
  groupId: string;
};

export default function GroupSettings() {
  const { group } = useOutletContext<GroupContextType>();
  const [isArchived, setIsArchived] = useState(group.isArchived);
  const [members, setMembers] = useState<Member[]>(group.members);

  const handleRemove = (index: number) => {
    const target = members[index];
    setMembers((prev) => prev.filter((_, i) => i !== index));
    removeMemberFromGroup(group.id, target.id);
  };

  const toggleArchive = () => {
    const next = !isArchived;
    setIsArchived(next);

    const target = mockGroups.find((g) => g.id === group.id);
    if (target) target.isArchived = next;
  };

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable
        members={members}
        showActions
        showAddButton
        groupId={group.id}
        isArchived={isArchived}
        onRemove={isArchived ? undefined : handleRemove}
      />

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
    </>
  );
}
