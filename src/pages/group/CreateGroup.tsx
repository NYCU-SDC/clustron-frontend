import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddMemberRow from "@/components/group/AddMemberRow";
import CsvUploadButton from "@/components/group/CsvUploadButton";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import {
  AccessLevelOwner,
  type GroupMemberRoleName,
  type GroupLinkPayload,
  CreateGroupInput,
} from "@/types/group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { normalizeUrl } from "@/lib/normalizeUrl";
import GroupLinkEditorTable, {
  type EditableGroupLink,
} from "@/components/group/GroupLinkEditorTable";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { roleNameToId, getRolesByAccessLevel } = useRoleMapper();

  const [title, setTitle] = useState("");
  const [ldapGroupName, setLdapGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<EditableGroupLink[]>([]);
  const [newLink, setNewLink] = useState<EditableGroupLink>({
    title: "",
    url: "",
  });
  const [members, setMembers] = useState<
    { id: string; roleName: GroupMemberRoleName }[]
  >([{ id: "", roleName: "student" }]);

  const createGroup = useCreateGroup({
    onSuccess: async (data) => {
      if (!data) {
        navigate(`/groups`);
        return;
      }

      const groupId = data.id;
      const validMembers = members.filter((m) => m.id.trim());

      if (validMembers.length === 0) {
        navigate(`/groups/${groupId}`);
        return;
      }

      navigate(`/groups/${groupId}/add-member-result`, {
        state: {
          result: {
            addedSuccessNumber: data.addedResult.addedSuccessNumber,
            addedFailureNumber: data.addedResult.addedFailureNumber,
            errors: data.addedResult.errors,
          },
          members: validMembers.map((m) => ({
            member: m.id.trim(),
            roleName: m.roleName,
          })),
        },
      });
    },
  });

  const updateRow = (index: number, key: "id" | "roleName", value: string) => {
    const next = [...members];
    next[index][key] = value as GroupMemberRoleName;
    setMembers(next);
  };

  const addRow = () =>
    setMembers((prev) => [...prev, { id: "", roleName: "student" }]);
  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", roleName: "student" }] : next);
  };

  function verifyLdapGroupName(ldapGroupName: string): boolean {
    if (/^[a-zA-Z]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(ldapGroupName)) {
      return true;
    }
    return false;
  }

  const isLdapGroupNameValid = verifyLdapGroupName(ldapGroupName);

  const handleSave = () => {
    if (!isLdapGroupNameValid) {
      return;
    }
    const newMembers = members.map((m) => {
      const roleId = roleNameToId(m.roleName);
      if (!roleId) throw new Error(`Invalid role: ${m.roleName}`);
      return { member: m.id.trim(), roleId };
    });

    const linksToSubmit: GroupLinkPayload[] = [
      ...links,
      ...(newLink.title.trim() && newLink.url.trim()
        ? [{ title: newLink.title.trim(), url: newLink.url }]
        : []),
    ]
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l) => ({
        title: l.title.trim(),
        url: normalizeUrl(l.url),
      }));

    createGroup.mutate({
      title,
      ldapGroupName,
      description,
      members: newMembers,
      links: linksToSubmit,
    } as CreateGroupInput);
  };

  const hasDuplicate = members.some(
    (m, i) =>
      members.findIndex((other) => other.id.trim() === m.id.trim()) !== i,
  );

  const handleAddBatch = (
    newMembers: { id: string; roleName: GroupMemberRoleName }[],
  ) => {
    setMembers((prev) => {
      const next = [...prev];
      let batchIndex = 0;
      for (let i = 0; i < next.length && batchIndex < newMembers.length; i++) {
        if (!next[i].id.trim()) {
          next[i] = { ...next[i], ...newMembers[batchIndex] };
          batchIndex++;
        }
      }
      return [...next, ...newMembers.slice(batchIndex)];
    });
  };

  const assignableRoles = getRolesByAccessLevel(AccessLevelOwner);

  return (
    <div className="flex-1 flex w-full flex-col items-center gap-6 px-4 py-6 sm:px-6">
      {/* Title / Description */}
      <Card className="w-full max-w-4xl p-3 sm:p-6">
        <div className="space-y-2">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">
              {t("groupPages.createGroup.courseTitle")}*
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3 sm:px-6">
            <Input
              placeholder={t("groupPages.createGroup.courseTitlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </CardContent>

          {/* LDAP Group Name */}
          <CardHeader className="mt-6 px-3 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">
              {t("groupPages.createGroup.ldapGroupNameTitle")}*
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3 sm:px-6">
            <Input
              placeholder={t("groupPages.createGroup.ldapGroupNamePlaceholder")}
              value={ldapGroupName}
              onChange={(e) => setLdapGroupName(e.target.value)}
              className={
                !isLdapGroupNameValid && ldapGroupName
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {!isLdapGroupNameValid && ldapGroupName && (
              <p className="text-sm font-medium text-destructive mt-1">
                {t("groupPages.createGroup.ldapGroupNameFormatError")}
              </p>
            )}
          </CardContent>

          {/* Description */}
          <CardHeader className="mt-6 px-3 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">
              {t("groupPages.createGroup.descriptionTitle")}*
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3 sm:px-6">
            <Textarea
              placeholder={t(
                "groupPages.createGroup.courseDescriptionPlaceholder",
              )}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[96px]"
            />
          </CardContent>
        </div>

        {/* Link Resource */}
        <div className="space-y-2">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">
              {t("groupPages.createGroup.linkTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <GroupLinkEditorTable
              links={links}
              newLink={newLink}
              onLinksChange={setLinks}
              onNewLinkChange={setNewLink}
              disabled={createGroup.isPending}
            />
          </CardContent>
        </div>
      </Card>

      {/* Add Member */}
      <Card className="w-full max-w-4xl p-3 sm:p-6">
        <CardHeader className="px-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl sm:text-2xl">
              {t("groupPages.createGroup.addInitialMembers")}
            </CardTitle>
            <CsvUploadButton
              assignableRoles={assignableRoles}
              onAddBatch={handleAddBatch}
              disabled={createGroup.isPending}
            />
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Table className="min-w-lg sm:min-w-xl">
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("groupPages.createGroup.studentIdOrEmail")}
                </TableHead>
                <TableHead>{t("groupPages.createGroup.role")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m, i) => {
                const isDuplicate = members
                  .filter((_, idx) => idx !== i)
                  .some((other) => other.id.trim() === m.id.trim());

                return (
                  <AddMemberRow
                    key={i}
                    index={i}
                    id={m.id}
                    roleName={m.roleName}
                    onChange={updateRow}
                    onAdd={addRow}
                    onRemove={removeRow}
                    isLast={i === members.length - 1}
                    onAddBatch={handleAddBatch}
                    assignableRoles={assignableRoles}
                    isDuplicate={isDuplicate}
                  />
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* button */}
      <div className="mb-10 flex w-full max-w-4xl flex-col gap-3 sm:flex-row">
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/groups")}
        >
          {t("groupPages.createGroup.cancel")}
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={handleSave}
          disabled={
            hasDuplicate ||
            !title.trim() ||
            createGroup.isPending ||
            !description.trim() ||
            !isLdapGroupNameValid
          }
        >
          {t("groupPages.createGroup.create")}
        </Button>
      </div>
    </div>
  );
}
