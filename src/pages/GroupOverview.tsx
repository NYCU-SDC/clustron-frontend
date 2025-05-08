import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import type { Group } from "@/lib/mockGroups";

type GroupContextType = {
  group: Group;
  groupId: string;
};

export default function GroupOverview() {
  const { group } = useOutletContext<GroupContextType>();

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />
      <GroupMemberTable members={group.members} showActions={false} />
    </>
  );
}
