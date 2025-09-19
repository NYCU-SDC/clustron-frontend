import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useJwtPayload } from "@/hooks/useJwtPayload";
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

  const createGroup = useCreateGroup({
    onSuccess: async (data) => {
      if (!data) {
        navigate(`/groups`);
        return;
      }

      const groupId = data.id;

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

  const handleSave = () => {
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
    setMembers((prev) => [...prev, ...newMembers]);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6">
      {/* Title / Description */}
      <Card className="w-2/3 max-w-4xl p-6">
        <div className="space-y-2">
          <CardHeader className="text-2xl">
            <CardTitle>{t("groupPages.createGroup.courseTitle")}*</CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              placeholder={t("groupPages.createGroup.courseTitlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </CardContent>

          {/* Description */}
          <CardHeader className="mt-6">
            <CardTitle className="text-2xl">
              {t("groupPages.createGroup.descriptionTitle")}*
            </CardTitle>
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

        {/* Link Resource */}
        <div className="space-y-2">
          <CardHeader className="text-2xl">
            <CardTitle>{t("groupPages.createGroup.linkTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="table-fixed w-full">
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
      <Card className="w-2/3 max-w-4xl p-6">
        <CardHeader className="text-2xl">
          <CardTitle className="text-2xl">
            {t("groupPages.createGroup.addInitialMembers")}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* button */}
      <div className="w-2/3 max-w-4xl flex justify-start gap-3 mb-10">
        <Button onClick={() => navigate("/groups")}>
          {t("groupPages.createGroup.cancel")}
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            hasDuplicate ||
            !title.trim() ||
            createGroup.isPending ||
            !description.trim()
          }
        >
          {t("groupPages.createGroup.create")}
        </Button>
      </div>
    </div>
  );
}
