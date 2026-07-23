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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea.tsx";
import { normalizeUrl } from "@/lib/normalizeUrl";
import GroupLinkEditorTable, {
  type EditableGroupLink,
} from "@/components/group/GroupLinkEditorTable";

type MemberDraft = {
  id: string;
  roleName: GroupMemberRoleName;
};

function formatRoleName(roleName: string) {
  const trimmedRoleName = roleName.trim();

  if (!trimmedRoleName) {
    return "-";
  }

  return trimmedRoleName.charAt(0).toUpperCase() + trimmedRoleName.slice(1);
}

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
  const [linkDrawerOpen, setLinkDrawerOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<EditableGroupLink>({
    title: "",
    url: "",
  });
  const [memberDrawerOpen, setMemberDrawerOpen] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(
    null,
  );
  const [memberDraft, setMemberDraft] = useState<MemberDraft>({
    id: "",
    roleName: "student",
  });

  const assignableRoles = getRolesByAccessLevel(AccessLevelOwner);
  const defaultMemberRole = assignableRoles[0]?.roleName ?? "student";

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

  const closeLinkDrawer = () => {
    setLinkDrawerOpen(false);
    setEditingLinkIndex(null);
    setLinkDraft({ title: "", url: "" });
  };

  const handleLinkDrawerOpenChange = (open: boolean) => {
    setLinkDrawerOpen(open);

    if (!open) {
      setEditingLinkIndex(null);
      setLinkDraft({ title: "", url: "" });
    }
  };

  const openNewLinkDrawer = () => {
    setEditingLinkIndex(null);
    setLinkDraft({ title: "", url: "" });
    setLinkDrawerOpen(true);
  };

  const openEditLinkDrawer = (index: number) => {
    setEditingLinkIndex(index);
    setLinkDraft({ ...links[index] });
    setLinkDrawerOpen(true);
  };

  const saveLinkDraft = () => {
    const title = linkDraft.title.trim();
    const url = normalizeUrl(linkDraft.url);

    if (!title || !url) {
      return;
    }

    setLinks((prev) => {
      if (editingLinkIndex === null) {
        return [...prev, { title, url }];
      }

      return prev.map((link, index) =>
        index === editingLinkIndex ? { ...link, title, url } : link,
      );
    });
    closeLinkDrawer();
  };

  const removeLinkDraft = () => {
    if (editingLinkIndex !== null) {
      setLinks((prev) => prev.filter((_, index) => index !== editingLinkIndex));
    }

    closeLinkDrawer();
  };

  const closeMemberDrawer = () => {
    setMemberDrawerOpen(false);
    setEditingMemberIndex(null);
    setMemberDraft({ id: "", roleName: defaultMemberRole });
  };

  const handleMemberDrawerOpenChange = (open: boolean) => {
    setMemberDrawerOpen(open);

    if (!open) {
      setEditingMemberIndex(null);
      setMemberDraft({ id: "", roleName: defaultMemberRole });
    }
  };

  const openNewMemberDrawer = () => {
    setEditingMemberIndex(null);
    setMemberDraft({ id: "", roleName: defaultMemberRole });
    setMemberDrawerOpen(true);
  };

  const openEditMemberDrawer = (index: number) => {
    setEditingMemberIndex(index);
    setMemberDraft({ ...members[index] });
    setMemberDrawerOpen(true);
  };

  const saveMemberDraft = () => {
    const id = memberDraft.id.trim();
    const roleName = memberDraft.roleName || defaultMemberRole;

    if (!id) {
      return;
    }

    setMembers((prev) => {
      const nextMember = { id, roleName };

      if (editingMemberIndex !== null) {
        return prev.map((member, index) =>
          index === editingMemberIndex ? nextMember : member,
        );
      }

      const emptyIndex = prev.findIndex((member) => !member.id.trim());

      if (emptyIndex === -1) {
        return [...prev, nextMember];
      }

      const next = [...prev];
      next[emptyIndex] = nextMember;
      return next;
    });
    closeMemberDrawer();
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
    const newMembers = members
      .filter((m) => m.id.trim())
      .map((m) => {
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
      m.id.trim() &&
      members.findIndex((other) => other.id.trim() === m.id.trim()) !== i,
  );
  const visibleMembers = members
    .map((member, index) => ({ ...member, index }))
    .filter((member) => member.id.trim());
  const hasDuplicateMemberDraft =
    !!memberDraft.id.trim() &&
    members.some(
      (member, index) =>
        index !== editingMemberIndex &&
        member.id.trim() === memberDraft.id.trim(),
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
            <div className="hidden sm:block">
              <GroupLinkEditorTable
                links={links}
                newLink={newLink}
                onLinksChange={setLinks}
                onNewLinkChange={setNewLink}
                disabled={createGroup.isPending}
              />
            </div>

            <div className="sm:hidden">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] text-xs">
                      {t("groupPages.createGroup.title")}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t("groupPages.createGroup.URL")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link, index) => (
                    <TableRow
                      key={link.id ?? index}
                      className="cursor-pointer"
                      onClick={() => openEditLinkDrawer(index)}
                    >
                      <TableCell className="font-medium">
                        <span className="line-clamp-1">{link.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-1 break-all text-muted-foreground">
                          {normalizeUrl(link.url)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                type="button"
                className="mt-4 w-full"
                onClick={openNewLinkDrawer}
                disabled={createGroup.isPending}
              >
                {t("groupPages.createGroup.addMoreLinks")}
              </Button>
            </div>
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
            <div className="hidden sm:block">
              <CsvUploadButton
                assignableRoles={assignableRoles}
                onAddBatch={handleAddBatch}
                disabled={createGroup.isPending}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="hidden sm:block">
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
                    .some(
                      (other) => m.id.trim() && other.id.trim() === m.id.trim(),
                    );

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
          </div>

          <div className="sm:hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[65%] text-xs">
                    {t("groupPages.createGroup.studentIdOrEmail")}
                  </TableHead>
                  <TableHead className="text-xs">
                    {t("groupPages.createGroup.role")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleMembers.map((member) => (
                  <TableRow
                    key={`${member.id}-${member.index}`}
                    className="cursor-pointer"
                    onClick={() => openEditMemberDrawer(member.index)}
                  >
                    <TableCell className="font-medium">
                      <span className="line-clamp-1 break-all">
                        {member.id}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRoleName(member.roleName)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              className="mt-4 w-full"
              onClick={openNewMemberDrawer}
              disabled={createGroup.isPending}
            >
              {t("groupPages.createGroup.addMoreUsers")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Drawer open={linkDrawerOpen} onOpenChange={handleLinkDrawerOpenChange}>
        <DrawerContent className="gap-4 p-5 sm:hidden" showCloseButton={false}>
          <DrawerHeader className="flex-row items-center justify-end p-0">
            <div>
              <DrawerTitle className="sr-only">
                {t("groupPages.createGroup.linkDrawerTitle")}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                {t("groupPages.createGroup.linkDrawerDescription")}
              </DrawerDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={removeLinkDraft}
              disabled={createGroup.isPending}
            >
              {t("groupPages.createGroup.removeLink")}
            </Button>
          </DrawerHeader>

          <div className="overflow-hidden rounded-lg border">
            <div className="border-b p-4">
              <label className="text-sm font-medium">
                {t("groupPages.createGroup.title")}
              </label>
              <Input
                className="mt-2"
                placeholder={t("groupPages.createGroup.linkTitlePlaceholder")}
                value={linkDraft.title}
                disabled={createGroup.isPending}
                onChange={(e) =>
                  setLinkDraft((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="p-4">
              <label className="text-sm font-medium">
                {t("groupPages.createGroup.URL")}
              </label>
              <Input
                className="mt-2"
                placeholder={t("groupPages.createGroup.URL")}
                value={linkDraft.url}
                disabled={createGroup.isPending}
                onChange={(e) =>
                  setLinkDraft((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DrawerFooter className="p-0">
            <Button
              type="button"
              className="w-full"
              onClick={saveLinkDraft}
              disabled={
                createGroup.isPending ||
                !linkDraft.title.trim() ||
                !linkDraft.url.trim()
              }
            >
              {t("groupPages.createGroup.linkDrawerDone")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={memberDrawerOpen}
        onOpenChange={handleMemberDrawerOpenChange}
      >
        <DrawerContent className="gap-4 p-5 sm:hidden" showCloseButton={false}>
          <DrawerHeader className="flex-row items-center justify-end p-0">
            <div>
              <DrawerTitle className="sr-only">
                {t("groupPages.createGroup.memberDrawerTitle")}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                {t("groupPages.createGroup.memberDrawerDescription")}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {t("groupPages.createGroup.cancel")}
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="overflow-hidden rounded-lg border">
            <div className="border-b p-4">
              <label className="text-sm font-medium">
                {t("groupPages.createGroup.memberDrawerDescription")}
              </label>
              <Input
                className="mt-2"
                placeholder={t(
                  "groupPages.createGroup.memberIdentifierPlaceholder",
                )}
                value={memberDraft.id}
                disabled={createGroup.isPending}
                onChange={(e) =>
                  setMemberDraft((prev) => ({
                    ...prev,
                    id: e.target.value,
                  }))
                }
              />
              {hasDuplicateMemberDraft && (
                <p className="mt-2 text-xs font-medium text-destructive">
                  {t("groupComponents.addMemberRow.duplicateEntry")}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm font-medium">
                {t("groupPages.createGroup.role")}
              </span>
              <Select
                value={memberDraft.roleName}
                disabled={createGroup.isPending}
                onValueChange={(value) =>
                  setMemberDraft((prev) => ({
                    ...prev,
                    roleName: value as GroupMemberRoleName,
                  }))
                }
              >
                <SelectTrigger
                  size="sm"
                  className="h-8 w-36 justify-end border-none bg-muted px-2 text-sm font-medium shadow-none hover:cursor-pointer focus-visible:ring-0"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.roleName}>
                      {formatRoleName(role.roleName)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter className="p-0">
            <Button
              type="button"
              className="w-full"
              onClick={saveMemberDraft}
              disabled={
                createGroup.isPending ||
                !memberDraft.id.trim() ||
                hasDuplicateMemberDraft
              }
            >
              {t("groupPages.createGroup.addMember")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
