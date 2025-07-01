import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { AccessLevelOwner, type GroupMemberRoleName } from "@/types/group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { GlobalRole } from "@/lib/permission";
import { Loader2 } from "lucide-react";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const payload = useJwtPayload();
  const { roleNameToId } = useRoleMapper();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<
    { id: string; role: GroupMemberRoleName }[]
  >([{ id: "", role: "student" }]);

  const createGroup = useCreateGroup({
    onSuccess: () => navigate(`/groups`),
  });

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value as GroupMemberRoleName;
    setMembers(next);
  };

  const addRow = () => setMembers([...members, { id: "", role: "student" }]);

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "student" }] : next);
  };

  const handleSave = () => {
    const newMembers = members.map((m) => {
      const roleId = roleNameToId(m.role);
      if (!roleId) throw new Error(`Invalid role: ${m.role}`);
      return {
        member: m.id.trim(),
        roleId,
      };
    });

    const payloadId = payload?.ID ?? "";
    const selfIncluded = members.some((m) => m.id.trim() === payloadId);
    if (!selfIncluded) {
      const ownerRoleId = roleNameToId("group_owner");
      if (!ownerRoleId) throw new Error("Missing group_owner role");
      newMembers.unshift({ member: payloadId, roleId: ownerRoleId });
    }

    createGroup.mutate({
      title,
      description,
      members: newMembers,
    });
  };

  const hasDuplicate = members.some(
    (m, i) =>
      members.findIndex((other) => other.id.trim() === m.id.trim()) !== i,
  );

  const handleAddBatch = (
    newMembers: { id: string; role: GroupMemberRoleName }[],
  ) => {
    setMembers((prev) => [...prev, ...newMembers]);
  };

  return (
    <div className="flex w-full justify-center">
      <main className="w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          {t("groupPages.createGroup.title")}
        </h1>

        <div className="mb-6 space-y-3">
          <Input
            placeholder={t("groupPages.createGroup.courseTitlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={t(
              "groupPages.createGroup.courseDescriptionPlaceholder",
            )}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
                  role={m.role}
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
          <Button
            onClick={() => navigate("/groups")}
            className="px-4 py-2 border rounded"
          >
            {t("groupPages.createGroup.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={hasDuplicate || !title.trim() || createGroup.isPending}
          >
            {t("groupPages.createGroup.create")}
          </Button>
        </div>
      </main>
    </div>
  );
}
