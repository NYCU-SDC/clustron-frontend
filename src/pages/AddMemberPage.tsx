import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddMemberRow from "@/components/group/AddMemberRow";
import { Member } from "@/lib/mockGroups";
import { findUserByIdOrEmail } from "@/lib/userMock";
import { useGroupContext } from "@/context/GroupContext";
import { useUserContext } from "@/context/UserContext";

export default function AddMemberPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { groups, setGroups } = useGroupContext();
  const { user } = useUserContext();
  const currentUserRole = user?.role || "Student";
  const group = groups.find((g) => g.id === groupId);
  const [members, setMembers] = useState([{ id: "", role: "Student" }]);

  if (!group) return <div className="p-6">Course not found.</div>;

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value;
    setMembers(next);
  };

  const addRow = () => setMembers([...members, { id: "", role: "Student" }]);

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "" }] : next);
  };

  const addBatchRows = (newData: { id: string; role: string }[]) => {
    setMembers((prev) => [...prev, ...newData]);
  };

  const handleSave = () => {
    const newMembers: Member[] = [];

    for (let i = 0; i < members.length; i++) {
      const input = members[i].id;
      const role = members[i].role;
      const user = findUserByIdOrEmail(input);

      if (!user) {
        alert(`User not found: ${input}`);
        return;
      }

      newMembers.push({
        id: user.id,
        username: user.username,
        email: user.email,
        studentId: user.studentId,
        dept: user.dept || "",
        role: role as Member["role"],
        accessLevel: user.accessLevel,
      });
    }

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? { ...g, members: [...g.members, ...newMembers] }
          : g,
      ),
    );

    navigate(`/group/${group.id}/settings`);
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
                  onAddBatch={addBatchRows}
                  currentUserRole={currentUserRole}
                  isDuplicate={isDuplicate} // ✅ 傳進去
                />
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/group/${group.id}/settings`)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-900 text-white rounded"
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}
