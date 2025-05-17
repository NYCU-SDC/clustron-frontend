import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useUserContext } from "@/context/UserContext";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useArchiveGroup } from "@/hooks/useArchiveGroup";
import { useUnarchiveGroup } from "@/hooks/useUnarchiveGroup";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import {
  // canAddMember,
  canRemoveMember,
  canArchiveGroup,
} from "@/lib/permission";

export type GroupContextType = {
  groupId: string;
};

export default function GroupSettings() {
  const { groupId } = useOutletContext<GroupContextType>();
  const { user } = useUserContext();
  const { data: group, isLoading } = useGetGroupById(groupId);

  const archiveMutation = useArchiveGroup();
  const unarchiveMutation = useUnarchiveGroup();
  const removeMutation = useRemoveMember(groupId, {
    onSuccess: () => console.log("Success Remove"),
    onError: (err) =>
      alert("刪除失敗：" + (err instanceof Error ? err.message : "")),
  });

  if (isLoading || !user || !group) {
    return <div className="p-4">Loading or user not found.</div>;
  }

  const accessLevel = group.me.role.accessLevel;
  const isAdmin = user.accessLevel === "admin";
  const canEdit = isAdmin || canRemoveMember(accessLevel);
  const canToggleArchive = isAdmin || canArchiveGroup(accessLevel);
  // const canAdd = isAdmin || canAddMember(accessLevel);

  const handleRemove = (memberId: string) => {
    removeMutation.mutate(memberId);
  };

  const toggleArchive = () => {
    if (group.isArchived) {
      unarchiveMutation.mutate(group.id);
    } else {
      archiveMutation.mutate(group.id);
    }
  };

  return (
    <>
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable
        groupId={group.id}
        isArchived={group.isArchived}
        onRemove={canEdit && !group.isArchived ? handleRemove : undefined}
        // showAddButton={canAdd}
        showActions={canEdit}
      />

      {canToggleArchive && (
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
