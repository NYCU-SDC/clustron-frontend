import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useCreateGroupLink } from "@/hooks/useGroupLinks";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import {
  AccessLevelOwner,
  type GroupMemberRoleName,
  type GroupLinkPayload,
} from "@/types/group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { GlobalRole } from "@/lib/permission";
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
  const payload = useJwtPayload();
  const { roleNameToId } = useRoleMapper();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<GroupLinkPayload[]>([]);
  const [newLink, setNewLink] = useState<GroupLinkPayload>({
    title: "",
    url: "",
  });
  const [members, setMembers] = useState<
    { id: string; roleName: GroupMemberRoleName }[]
  >([{ id: "", roleName: "student" }]);

  const { mutateAsync: createLink } = useCreateGroupLink();

  const createGroup = useCreateGroup({
    onSuccess: async (data) => {
      if (!data) {
        navigate(`/groups`);
        return;
      }

      const groupId = data.id;

      const pending: GroupLinkPayload[] = [
        ...links,
        ...(newLink.title.trim() && newLink.url.trim()
          ? [{ title: newLink.title.trim(), url: newLink.url.trim() }]
          : []),
      ].filter((l) => l.title.trim() && l.url.trim());

      if (pending.length) {
        await Promise.allSettled(
          pending.map((payload) => createLink({ groupId, payload })),
        );
      }

      navigate(`/groups/${groupId}/add-member-result`, {
        state: {
          result: {
            addedSuccessNumber: data.addedResult.addedSuccessNumber,
            addedFailureNumber: data.addedResult.addedFailureNumber,
            errors: data.addedResult.errors,
          },
          members: members
            .filter((m) => m.id.trim())
            .map((m) => ({
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
  const handleAddBatch = (
    newMembers: { id: string; roleName: GroupMemberRoleName }[],
  ) => {
    setMembers((prev) => [...prev, ...newMembers]);
  };

  const handleAddLink = () => {
    const title = newLink.title.trim();
    const url = newLink.url.trim();
    if (!title || !url) return;
    setLinks((prev) => [...prev, { title, url }]);
    setNewLink({ title: "", url: "" });
  };
  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newMembers = members.map((m) => {
      const roleId = roleNameToId(m.roleName);
      if (!roleId) throw new Error(`Invalid role: ${m.roleName}`);
      return { member: m.id.trim(), roleId };
    });

    createGroup.mutate({ title, description, members: newMembers });
  };

  const hasDuplicate = members.some(
    (m, i) => members.findIndex((o) => o.id.trim() === m.id.trim()) !== i,
  );

  return (
    <div className="flex-1 flex justify-center">
      <Card className="w-2/3 max-w-4xl p-6">
        <div className="space-y-2">
          <CardHeader className="text-2xl">
            <CardTitle className="text-2xl">
              {t("groupPages.createGroup.title")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              placeholder={t("groupPages.createGroup.courseTitlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </CardContent>

          <CardHeader>
            <CardTitle className="text-2xl">Description</CardTitle>
          </CardHeader>

          <CardContent>
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

        <div className="space-y-2">
          <CardHeader className="text-2xl">
            <CardTitle className="text-2xl">Link Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link, index) => (
                  <TableRow key={index} className="hover:bg-muted">
                    <TableCell>{link.title}</TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-muted-foreground break-all"
                      >
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell className="w-10">
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
                      placeholder="Title"
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
                      placeholder="URL"
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink((prev) => ({ ...prev, url: e.target.value }))
                      }
                    />
                  </TableCell>
                  <TableCell className="w-10">
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

        <h2 className="text-lg font-semibold mb-2">
          {t("groupPages.createGroup.addInitialMembers")}
        </h2>
        <Table>
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
                  globalRole={payload?.Role as GlobalRole}
                  accessLevel={AccessLevelOwner}
                  isDuplicate={isDuplicate}
                />
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => navigate("/groups")} variant="secondary">
            {t("groupPages.createGroup.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={hasDuplicate || !title.trim() || createGroup.isPending}
          >
            {createGroup.isPending
              ? (t("groupPages.createGroup.saving") ?? "Saving...")
              : t("groupPages.createGroup.create")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
