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
  const user = useJwtPayload(); // use JWT hook to get user information
  const archiveMutation = useArchiveGroup(groupId);
  const unarchiveMutation = useUnarchiveGroup(groupId);
  const removeMutation = useRemoveMember(groupId, {
    onSuccess: () => console.log("成員已刪除"),
    onError: (err) =>
      alert(" 刪除失敗：" + (err instanceof Error ? err.message : "")),
  });

  const isAdmin = group?.me?.type === "adminOverride";
  const accessLevel = group?.me.role.accessLevel;
  const baseCanArchive = useGroupPermissions(accessLevel).canArchive;
  const canArchive = isAdmin || baseCanArchive;

  // console.log("ACC", isAdmin, "\\", baseCanArchive, "\\", canArchive);

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
        // accessLevel={group.me.role.accessLevel}
        accessLevel="GROUP_OWNER" //TODO wait backend
        isArchived={group.isArchived}
        onRemove={handleRemove}
      />

      {canArchive && (
        <div className="mt-10 p-4 border rounded bg-gray-50">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h2 className="font-bold text-lg">
                {group.isArchived
                  ? "Unarchive This Group"
                  : "Archive This Group"}
              </h2>
              <p className="text-sm text-gray-600">
                {group.isArchived
                  ? "This will reactivate the group and allow updates again."
                  : "This will turn the group into archive state, no update can be made before it is activated again."}
              </p>
            </div>

            <button
              onClick={toggleArchive}
              className="bg-gray-900 text-white px-4 py-2 rounded whitespace-nowrap"
              disabled={
                archiveMutation.isPending || unarchiveMutation.isPending
              }
            >
              {archiveMutation.isPending || unarchiveMutation.isPending
                ? "Saving..."
                : group.isArchived
                  ? "Unarchive"
                  : "Archive"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
