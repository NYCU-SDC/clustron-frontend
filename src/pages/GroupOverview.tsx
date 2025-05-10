import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useUserContext } from "@/context/UserContext";
import type { Group } from "@/lib/mockGroups";

type GroupContextType = {
  group: Group;
  groupId: string;
};

export default function GroupOverview() {
  const { group, isPreview } = useOutletContext<
    GroupContextType & { isPreview?: boolean }
  >();
  const { user } = useUserContext();

  if (!user) return <div className="p-4">尚未登入</div>;

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />
      {!isPreview && (
        <GroupMemberTable
          members={group.members}
          groupId={group.id}
          showActions={false}
        />
      )}
    </>
  );
}
