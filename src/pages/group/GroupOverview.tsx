// import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDescription.tsx";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import type { GroupDetail } from "@/types/group";

type GroupContext = {
  group: GroupDetail;
  groupId: string;
};
export default function GroupOverviewPage() {
  const { group, groupId } = useOutletContext<GroupContext>();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GroupDescription
        title={group.title}
        desc={group.description}
        links={group.links ?? []}
      />
      <GroupMemberTable
        groupId={groupId}
        isArchived={group.isArchived}
        isOverview={true}
      />
    </div>
  );
}
