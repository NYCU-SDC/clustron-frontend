import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useAddMember } from "@/hooks/useAddMember"; // 引入 useAddMember
import { useUserContext } from "@/context/UserContext";
import { useGroupContext } from "@/context/GroupContext";

export default function AddMemberPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { groups } = useGroupContext();
  const { user } = useUserContext();
  const currentUserRole = user?.role || "Student";
  const group = groups.find((g) => g.id === groupId);
  const [members, setMembers] = useState([{ id: "", role: "Student" }]);

  const { mutate: addMember } = useAddMember(groupId!, {
    onSuccess: () => {
      navigate(`/groups/${groupId}/settings`);
    },
  });

  if (!group) return <div className="p-6">Course not found.</div>;

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value;
    setMembers(next);
  };

  const addRow = () => setMembers([...members, { id: "", role: "Student" }]);

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "Student" }] : next);
  };

  const handleSave = () => {
    const newMembers = members.map((m) => ({
      member: m.id,
      role: m.role,
    }));

    addMember(newMembers); // 使用 useAddMember mutation 來新增成員
  };

  const hasDuplicate = members.some(
    (m, i) =>
      members.findIndex((other) => other.id.trim() === m.id.trim()) !== i,
  );

  const handleAddBatch = (newMembers: { id: string; role: string }[]) => {
    setMembers((prev) => [...prev, ...newMembers]);
  };

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Members</h1>
        <table className="w-full text-left text-sm border-t border-gray-200">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2">Student ID or Email</th>
              <th className="py-2">Role</th>
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
                  onChange={updateRow}
                  onAdd={addRow}
                  onRemove={removeRow}
                  isLast={i === members.length - 1}
                  currentUserRole={currentUserRole}
                  isDuplicate={isDuplicate}
                  onAddBatch={handleAddBatch}
                />
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex gap-3">
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
