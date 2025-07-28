import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import PendingMemberTable from "@/components/group/PendingMemberTable";
import { useArchiveGroup } from "@/hooks/useArchiveGroup";
import { useUnarchiveGroup } from "@/hooks/useUnarchiveGroup";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useTransferGroupOwner } from "@/hooks/useTransferGroupOwner";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { GlobalRole } from "@/lib/permission";
import { GroupDetail } from "@/types/group";
import { useQueryClient } from "@tanstack/react-query";

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

  const [email, setEmail] = useState("");
  const { mutate: transferOwner, isPending: isTransferring } =
    useTransferGroupOwner(groupId, () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      setEmail("");
    });

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

  const handleTransfer = () => {
    transferOwner({ identifier: email });
  };

  if (!user || !group) {
    return (
      <div className="p-4 text-gray-600">
        {t("groupPages.groupSettings.loadingGroupInfo")}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GroupDescription title={group.title} desc={group.description} />

      <GroupMemberTable
        groupId={group.id}
        accessLevel={accessLevel}
        globalRole={isAdmin ? "admin" : undefined}
        isArchived={group.isArchived}
        onRemove={handleRemove}
        isOverview={false}
      />

      <PendingMemberTable
        groupId={group.id}
        accessLevel={accessLevel}
        globalRole={isAdmin ? "admin" : undefined}
        isArchived={group.isArchived}
      />

      {canArchive && (
        <Card>
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
              className="min-w-[100px]"
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

      <Card>
        <CardHeader>
          <CardTitle>{t("groupSettings.transferOwnership.title")}</CardTitle>
          <CardDescription>
            {t("groupSettings.transferOwnership.description")}
            <br />
            <span className="text-red-500 font-medium">
              {t("groupSettings.transferOwnership.notice")}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 placeholder:text-gray-400"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEmail("")}>
              {t("groupSettings.cancel")}
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!email || isTransferring}
            >
              {isTransferring ? "Transferring..." : t("groupSettings.transfer")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
