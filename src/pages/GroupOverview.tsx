// src/pages/GroupOverviewPage.tsx
import { useParams } from "react-router-dom";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";

export default function GroupOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGetGroupById(id ?? "");

  if (!id) return <div className="p-6">請提供課程 ID</div>;
  if (isLoading) return <div className="p-6">載入中...</div>;
  if (isError || !group) return <div className="p-6">找不到課程</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable groupId={group.id} isArchived={group.isArchived} />
    </div>
  );
}
