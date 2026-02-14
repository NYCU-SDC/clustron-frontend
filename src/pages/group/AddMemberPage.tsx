import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useAddMember } from "@/hooks/useAddMember";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import {
  AccessLevelUser,
  MemberRow,
  type GroupMemberRoleName,
  type AddMembersResult,
} from "@/types/group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { GlobalRole } from "@/lib/permission";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { Button } from "@/components/ui/button";

export default function AddMemberPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: group, isLoading } = useGetGroupById(groupId!);
  const { roleNameToId } = useRoleMapper();
  const payload = useJwtPayload();

  const [members, setMembers] = useState<MemberRow[]>([
    { rowId: crypto.randomUUID(), id: "", roleName: "student" },
  ]);

  const syncFailureState = (data: AddMembersResult) => {
    const errorMap = new Map(
      data.errors.map((e) => [e.member.trim(), e.message]),
    );

    setMembers((prev) => {
      return prev
        .filter((m) => errorMap.has(m.id.trim()))
        .map((m) => ({
          ...m,
          error: errorMap.get(m.id.trim()),
        }));
    });
  };

  const addMember = useAddMember(groupId!, {
    onSuccess: (data) => {
      if (data.addedFailureNumber > 0) {
        syncFailureState(data);
      } else {
        navigate(`/groups/${groupId}/settings`);
      }
    },
    onError: (err) => {
      const errorData = err.data as AddMembersResult;
      if (errorData?.errors) {
        syncFailureState(errorData);
      }
    },
  });

  if (isLoading)
    return <div className="p-6">{t("groupPages.addMemberPage.loading")}</div>;
  if (!group)
    return (
      <div className="p-6">{t("groupPages.addMemberPage.courseNotFound")}</div>
    );

  const accessLevel = group.me.role.accessLevel ?? AccessLevelUser;

  const updateRow = (index: number, key: "id" | "roleName", value: string) => {
    setMembers((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, [key]: value, error: undefined } : m,
      ),
    );
  };

  const addRow = () =>
    setMembers((prev) => [
      ...prev,
      { rowId: crypto.randomUUID(), id: "", roleName: "student" },
    ]);

  const removeRow = (index: number) => {
    setMembers((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0
        ? [{ rowId: crypto.randomUUID(), id: "", roleName: "student" }]
        : next;
    });
  };

  const handleSave = () => {
    const newMembers = members.map((m) => {
      const roleId = roleNameToId(m.roleName);
      if (!roleId) throw new Error(`Invalid roleName: ${m.roleName}`);
      return {
        member: m.id.trim(),
        roleId,
      };
    });
    addMember.mutate(newMembers);
  };

  const hasDuplicate = members.some(
    (m, i) =>
      members.findIndex((other) => other.id.trim() === m.id.trim()) !== i,
  );

  const handleAddBatch = (
    newMembers: { id: string; roleName: GroupMemberRoleName }[],
  ) => {
    const batchWithIds = newMembers.map((m) => ({
      ...m,
      rowId: crypto.randomUUID(),
    }));
    setMembers((prev) => [...prev, ...batchWithIds]);
  };

  return (
    <div className="flex w-2/3 justify-center">
      <main className="w-full max-w-5xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          {t("groupPages.addMemberPage.title")}
        </h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t("groupPages.addMemberPage.studentIdOrEmail")}
              </TableHead>
              <TableHead>{t("groupPages.addMemberPage.role")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m, i) => {
              const isDuplicate = members
                .filter((_, idx) => idx !== i)
                .some((other) => other.id.trim() === m.id.trim());

              return (
                <AddMemberRow
                  key={m.rowId}
                  index={i}
                  id={m.id}
                  roleName={m.roleName}
                  error={m.error}
                  accessLevel={accessLevel}
                  globalRole={payload?.Role as GlobalRole}
                  onChange={updateRow}
                  onAdd={addRow}
                  onRemove={removeRow}
                  isLast={i === members.length - 1}
                  isDuplicate={isDuplicate}
                  onAddBatch={handleAddBatch}
                />
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/groups/${group.id}/settings`)}
            className="px-4 py-2 border rounded"
          >
            {t("groupPages.addMemberPage.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={hasDuplicate || addMember.isPending}
          >
            {t("groupPages.addMemberPage.save")}
          </Button>
        </div>
      </main>
    </div>
  );
}
