import { useState } from "react";
import AddMemberRow from "@/components/group/AddMemberRow";
import GroupSideBarTEMP from "@/components/group/GroupSideBarTEMP";
import { useNavigate } from "react-router-dom";

export default function AddMemberPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([{ id: "", role: "" }]);

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value;
    setMembers(next);
  };

  const addRow = () => setMembers([...members, { id: "", role: "" }]);

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "" }] : next);
  };

  return (
    <GroupSideBarTEMP>
      <div className="flex">
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Members</h1>
          <table className="w-full text-left text-sm border-t border-gray-200">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">Student ID or Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Server Access</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <AddMemberRow
                  key={i}
                  index={i}
                  id={m.id}
                  role={m.role}
                  onChange={updateRow}
                  onAdd={addRow}
                  onRemove={removeRow}
                  isLast={i === members.length - 1}
                />
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 border rounded">Cancel</button>
            <button
              onClick={() => navigate("/GroupMem")}
              className="px-4 py-2 bg-gray-900 text-white rounded"
            >
              Save
            </button>
          </div>
        </main>
      </div>
    </GroupSideBarTEMP>
  );
}
