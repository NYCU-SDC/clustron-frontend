//帶改，沒用到update
import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useArchiveGroup } from "@/hooks/useArchiveGroup";
import { useUnarchiveGroup } from "@/hooks/useUnarchiveGroup";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";

export type GroupContextType = {
  groupId: string;
};

export default function GroupSettings() {
  const { groupId } = useOutletContext<GroupContextType>();
  const { data: group, isLoading } = useGetGroupById(groupId);
  const user = useJwtPayload(); // 👈 用 JWT hook 拿使用者資料

  const archiveMutation = useArchiveGroup(groupId);
  const unarchiveMutation = useUnarchiveGroup(groupId);
  const removeMutation = useRemoveMember(groupId, {
    onSuccess: () => console.log("✅ 成員已刪除"),
    onError: (err) =>
      alert("❌ 刪除失敗：" + (err instanceof Error ? err.message : "")),
  });

  const accessLevel = group?.me?.role.accessLevel;
  const { canEditMembers, canArchive } = useGroupPermissions(accessLevel);

  const handleRemove = (memberId: string) => {
    removeMutation.mutate(memberId);
  };

  const toggleArchive = () => {
    if (!group) return;
    if (group.isArchived) {
      unarchiveMutation.mutate();
    } else {
      archiveMutation.mutate();
    }
  };

  if (isLoading || !user || !group) {
    return <div className="p-4 text-gray-600">Loading group info...</div>;
  }

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable
        groupId={group.id}
        isArchived={group.isArchived}
        onRemove={
          canEditMembers && !group.isArchived ? handleRemove : undefined
        }
        showActions={canEditMembers}
      />

      {canArchive && (
        <div className="mt-10 p-4 border rounded bg-gray-50">
          <h2 className="font-bold text-lg mb-2">
            {group.isArchived ? "Unarchive This Group" : "Archive This Group"}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {group.isArchived
              ? "This will reactivate the group and allow updates again."
              : "This will turn the group into archive state, no update can be made before it is activated again."}
          </p>
          <button
            onClick={toggleArchive}
            className="bg-gray-900 text-white px-4 py-2 rounded"
            disabled={archiveMutation.isPending || unarchiveMutation.isPending}
          >
            {archiveMutation.isPending || unarchiveMutation.isPending
              ? "Saving..."
              : group.isArchived
                ? "Unarchive"
                : "Archive"}
          </button>
        </div>
      )}
    </>
  );
}
