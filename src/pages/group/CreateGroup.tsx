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
  TableCell,
} from "@/components/ui/table";
import { CircleMinus, CirclePlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { roleNameToId, getRolesByAccessLevel } = useRoleMapper();

  const [title, setTitle] = useState("");
  const [ldapGroupName, setLdapGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<GroupLinkPayload[]>([]);
  const [newLink, setNewLink] = useState<GroupLinkPayload>({
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

  const handleAddLink = () => {
    const title = newLink.title.trim();
    const url = newLink.url.trim();
    if (!title || !url) return;
    setLinks((prev) => [...prev, { title, url: normalizeUrl(url) }]);
    setNewLink({ title: "", url: "" });
  };
  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

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
        ? [{ title: newLink.title.trim(), url: normalizeUrl(newLink.url) }]
        : []),
    ]
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l) => ({
        title: l.title.trim(),
        url: l.url,
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
            <Table className="min-w-lg table-fixed sm:min-w-xl">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%] text-gray-500 dark:text-white">
                    {t("groupPages.createGroup.title")}
                  </TableHead>
                  <TableHead className="w-[60%] text-gray-500 dark:text-white">
                    {t("groupPages.createGroup.URL")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link, index) => (
                  <TableRow key={index} className="hover:bg-muted ">
                    <TableCell>{link.title}</TableCell>
                    <TableCell className="w-[30%] break-all text1-foreground">
                      <div className="max-w-full overflow-hidden">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all block"
                        >
                          {link.url}
                        </a>
                      </div>
                    </TableCell>

                    <TableCell className="flex justify-center ">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <CircleMinus size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Input
                      placeholder={t("groupPages.createGroup.title")}
                      value={newLink.title}
                      onChange={(e) =>
                        setNewLink((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder={t("groupPages.createGroup.URL")}
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                    />
                    {newLink.url.trim() && (
                      <div className="text-xs text-muted-foreground break-all overflow-hidden">
                        <a
                          href={normalizeUrl(newLink.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all block"
                        >
                          {normalizeUrl(newLink.url)}
                        </a>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddLink}
                      disabled={!newLink.title.trim() || !newLink.url.trim()}
                    >
                      <CirclePlus size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
