// import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
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
    <div className="w-full max-w-2xl px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-10">
      <GroupDescription
        title={group.title}
        ldapGroupName={group.ldapGroupName}
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
