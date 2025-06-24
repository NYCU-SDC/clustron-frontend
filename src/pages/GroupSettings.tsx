import { useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useArchiveGroup } from "@/hooks/useArchiveGroup";
import { useUnarchiveGroup } from "@/hooks/useUnarchiveGroup";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GlobalRole } from "@/types/group";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export type GroupContextType = {
  groupId: string;
};

export default function GroupSettings() {
  const { groupId } = useOutletContext<GroupContextType>();
  const { data: group, isLoading } = useGetGroupById(groupId);
  const user = useJwtPayload();
  const archiveMutation = useArchiveGroup(groupId);
  const unarchiveMutation = useUnarchiveGroup(groupId);
  const queryClient = useQueryClient();

  const removeMutation = useRemoveMember(groupId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", groupId] });
    },
    onError: (err) =>
      alert("❌ 刪除失敗：" + (err instanceof Error ? err.message : "")),
  });

  const payload = useJwtPayload();
  const globalRole = payload?.Role as GlobalRole;
  const isAdmin = group?.me?.type === "adminOverride";
  const accessLevel = group?.me.role.accessLevel;
  const baseCanArchive = useGroupPermissions(
    accessLevel,
    globalRole,
  ).canArchive;
  const canArchive = isAdmin || baseCanArchive;

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

  const isToggling = archiveMutation.isPending || unarchiveMutation.isPending;

  if (isLoading || !user || !group) {
    return (
      <div className="p-4 text-gray-600 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading group info...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable
        groupId={group.id}
        accessLevel={group.me.role.accessLevel}
        globalRole={isAdmin ? "admin" : undefined}
        isArchived={group.isArchived}
        onRemove={handleRemove}
      />

      {canArchive && (
        <Card className="mt-10">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>
                {group.isArchived
                  ? "Unarchive This Group"
                  : "Archive This Group"}
              </CardTitle>
              <CardDescription>
                {group.isArchived
                  ? "This will reactivate the group and allow updates again."
                  : "This will turn the group into archive state, no update can be made before it is activated again."}
              </CardDescription>
            </div>
            <Button
              onClick={toggleArchive}
              className="min-w-[100px] px-4 py-2"
              disabled={isToggling}
            >
              {isToggling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : group.isArchived ? (
                "Unarchive"
              ) : (
                "Archive"
              )}
            </Button>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
