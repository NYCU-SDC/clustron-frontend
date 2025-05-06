import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useState } from "react";
import type { Member, Group } from "@/lib/courseMock";
import { removeMemberFromGroup } from "@/lib/courseMock";
export type GroupContextType = {
  group: Group;
  groupId: string;
};

export default function GroupSettings() {
  const { group } = useOutletContext<GroupContextType>();
  const [members, setMembers] = useState<Member[]>(group.members);

  const handleRemove = (index: number) => {
    const target = members[index];
    setMembers((prev) => prev.filter((_, i) => i !== index));
    removeMemberFromGroup(group.id, target.id); // ✅ 同步 mock 資料
  };

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />
      <div className="flex justify-end mb-4"></div>
      <GroupMemberTable
        members={members}
        showActions
        showAddButton
        groupId={group.id}
        onRemove={handleRemove}
      />
    </>
  );
}
