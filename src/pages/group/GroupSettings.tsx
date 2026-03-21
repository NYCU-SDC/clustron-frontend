import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GroupDescription from "@/components/group/GroupDescription.tsx";
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
import { toast } from "sonner";
import { useUserAutocomplete } from "@/hooks/useUserAutocomplete.ts";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type GroupContextType = {
  group: GroupDetail;
  groupId: string;
};

export default function GroupSettings() {
  const { group, groupId } = useOutletContext<GroupContextType>();
  const { t } = useTranslation();
  const user = useJwtPayload();

  const archiveMutation = useArchiveGroup(groupId);
  const unarchiveMutation = useUnarchiveGroup(groupId);
  const removeMutation = useRemoveMember(groupId);

  const payload = useJwtPayload();
  const globalRole = payload?.Role as GlobalRole;
  const isAdmin = group?.me?.type === "adminOverride";
  const accessLevel = group?.me.role.accessLevel;
  const canManage = getGroupPermissions(accessLevel, globalRole).canManageGroup;

  const [transferOwnerEmail, setTransferOwnerEmail] = useState("");
  const [isTransferExpanded, setIsTransferExpanded] = useState(false);

  const { mutate: transferOwner, isPending: isTransferring } =
    useTransferGroupOwner(groupId, {
      onSuccess: () => {
        toast.success(t("groupSettings.toast.success"));
        setTransferOwnerEmail("");
        setQuery("");
        setIsTransferExpanded(false);
      },
      onError: () => {
        toast.error(t("groupSettings.toast.fail"));
      },
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

  const { query, setQuery, suggestions, showSuggestions, handleSelect } =
    useUserAutocomplete();

  const handleTransfer = () => {
    transferOwner({ identifier: transferOwnerEmail || query });
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
      <GroupDescription
        title={group.title}
        desc={group.description}
        links={group.links ?? []}
      />

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

      {canManage && (
        <>
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
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>
                  {t("groupSettings.transferOwnership.title")}
                </CardTitle>
                <CardDescription>
                  {t("groupSettings.transferOwnership.description1")}
                </CardDescription>
              </div>

              {!isTransferExpanded && (
                <Button
                  onClick={() => setIsTransferExpanded(true)}
                  disabled={group.isArchived || isToggling}
                >
                  {t("groupSettings.transferOwnership.startButton")}
                </Button>
              )}
            </CardHeader>

            {isTransferExpanded && (
              <CardContent>
                <p className="text-sm font-medium mb-2">
                  {t("groupSettings.transferOwnership.description2")}
                </p>
                <p className="text-sm text-red-500 font-medium mb-2">
                  {t("groupSettings.transferOwnership.notice")}
                </p>
                <div className="mb-4">
                  <Combobox items={suggestions}>
                    <ComboboxInput
                      showTrigger={false}
                      value={transferOwnerEmail || query}
                      disabled={isToggling}
                      placeholder="example@email.com"
                      className="h-10 w-full text-sm"
                      onChange={(e) => {
                        setTransferOwnerEmail(e.target.value);
                        setQuery(e.target.value);
                      }}
                    />

                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      {showSuggestions && suggestions.length > 0 && (
                        <ComboboxList>
                          {(user) => (
                            <ComboboxItem
                              key={user.identifier}
                              value={user.identifier}
                              onClick={() => {
                                handleSelect(user);
                                setTransferOwnerEmail(user.identifier);
                              }}
                            >
                              {user.identifier}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      )}
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTransferExpanded(false);
                      setTransferOwnerEmail("");
                      setQuery("");
                    }}
                  >
                    {t("groupSettings.cancel")}
                  </Button>
                  <Button
                    onClick={handleTransfer}
                    disabled={
                      !transferOwnerEmail ||
                      isTransferring ||
                      isToggling ||
                      group.isArchived
                    }
                  >
                    {isTransferring
                      ? t("groupSettings.transferOwnership.transferring")
                      : t("groupSettings.transfer")}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
