import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useAddMember } from "@/hooks/useAddMember";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import type { GroupMemberRoleName } from "@/types/group";

export default function AddMemberPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { data: group, isLoading } = useGetGroupById(groupId!);
  const payload = useJwtPayload();

  const [members, setMembers] = useState<
    { id: string; role: GroupMemberRoleName }[]
  >([{ id: "", role: "Student" }]);

  const { mutate: addMember } = useAddMember(groupId!, {
    onSuccess: () => navigate(`/groups/${groupId}/settings`),
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!group) return <div className="p-6">Course not found.</div>;

  const accessLevel = group.me.role.accessLevel ?? "USER";

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value as GroupMemberRoleName;
    setMembers(next);
  };

  const addRow = () => setMembers([...members, { id: "", role: "Student" }]);

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "Student" }] : next);
  };

  const handleSave = () => {
    const newMembers = members.map((m) => ({
      member: m.id.trim(),
      role: m.role,
    }));
    addMember(newMembers);
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
    <div className="flex justify-center">
      <main className="w-full max-w-5xl p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Members</h1>
        <table className="w-full text-left text-sm border-t border-gray-200">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2 w-2/3">Student ID or Email</th>
              <th className="py-2 w-1/3">Role</th>
              <th className="py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
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
                  accessLevel={accessLevel}
                  globalRole={payload?.role}
                  onChange={updateRow}
                  onAdd={addRow}
                  onRemove={removeRow}
                  isLast={i === members.length - 1}
                  isDuplicate={isDuplicate}
                  onAddBatch={handleAddBatch}
                />
              );
            })}
          </tbody>
        </table>

        {/* 對齊右邊的按鈕列 */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate(`/groups/${group.id}/settings`)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={hasDuplicate}
            className={`px-4 py-2 rounded text-white ${
              hasDuplicate ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900"
            }`}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}
