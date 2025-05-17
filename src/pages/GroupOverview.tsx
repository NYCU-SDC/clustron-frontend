import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useUserContext } from "@/context/UserContext";
import { useGetGroupById } from "@/hooks/useGetGroupById";

type GroupContextType = {
  groupId: string;
};

export default function GroupOverview() {
  const { groupId } = useOutletContext<GroupContextType>();
  const { user } = useUserContext();

  const { data: group, isLoading } = useGetGroupById(groupId);

  if (!user) return <div className="p-4">尚未登入</div>;
  if (isLoading || !group) return <div className="p-4">Loading...</div>;

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />
      {
        <GroupMemberTable
          groupId={group.id}
          showActions={false}
          isArchived={group.isArchived}
        />
      }
    </>
  );
}
//改
