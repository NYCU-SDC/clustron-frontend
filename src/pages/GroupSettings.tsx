import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import PendingMemberTable from "@/components/group/PendingMemberTable";
import { useArchiveGroup } from "@/hooks/useArchiveGroup";
import { useUnarchiveGroup } from "@/hooks/useUnarchiveGroup";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GroupDetail } from "@/types/group";
import { useQueryClient } from "@tanstack/react-query";
import { GlobalRole } from "@/lib/permission";

type GroupContextType = {
  group: GroupDetail;
  groupId: string;
};

export default function GroupSettings() {
  const { group, groupId } = useOutletContext<GroupContextType>();
  const { t } = useTranslation();
  const user = useJwtPayload();
  const queryClient = useQueryClient();

  const archiveMutation = useArchiveGroup(groupId);
  const unarchiveMutation = useUnarchiveGroup(groupId);

  const removeMutation = useRemoveMember(groupId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", groupId] });
    },
    onError: (err) =>
      alert(
        t("groupPages.groupSettings.deleteFailed") +
          (err instanceof Error ? err.message : ""),
      ),
  });
  const payload = useJwtPayload();
  const globalRole = payload?.Role as GlobalRole;
  const isAdmin = group?.me?.type === "adminOverride";
  const accessLevel = group?.me.role.accessLevel;
  const baseCanArchive = getGroupPermissions(
    accessLevel,
    globalRole,
  ).canArchive;
  const canArchive = isAdmin || baseCanArchive;

  const handleRemove = (memberId: string) => {
    removeMutation.mutate(memberId);
  };

  const toggleArchive = () => {
    if (group.isArchived) {
      unarchiveMutation.mutate();
    } else {
      archiveMutation.mutate();
    }
  };

  const isToggling = archiveMutation.isPending || unarchiveMutation.isPending;

  if (!user || !group) {
    return (
      <div className="p-4 text-gray-600">
        {t("groupPages.groupSettings.loadingGroupInfo")}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <GroupDescription title={group.title} desc={group.description} />
        <GroupMemberTable
          groupId={group.id}
          accessLevel={group.me.role.accessLevel} //
          globalRole={isAdmin ? "admin" : undefined} //
          isArchived={group.isArchived}
          onRemove={handleRemove}
          isOverview={false}
        />
        <PendingMemberTable
          groupId={group.id} //
          accessLevel={group.me.role.accessLevel} //
          globalRole={isAdmin ? "admin" : undefined} //
          isArchived={group.isArchived}
        />
        {canArchive && (
          <Card className="mt-10">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>
                  {group.isArchived
                    ? t("groupPages.groupSettings.unarchiveGroup")
                    : t("groupPages.groupSettings.archiveGroup")}
                </CardTitle>
                <CardDescription>
                  {group.isArchived
                    ? t("groupPages.groupSettings.unarchiveDescription")
                    : t("groupPages.groupSettings.archiveDescription")}
                </CardDescription>
              </div>
              <Button
                onClick={toggleArchive}
                className="min-w-[100px] px-4 py-2 "
                disabled={isToggling}
              >
                {isToggling
                  ? t("groupPages.groupSettings.saving")
                  : group.isArchived
                    ? t("groupPages.groupSettings.unarchive")
                    : t("groupPages.groupSettings.archive")}
              </Button>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
}
