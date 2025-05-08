import { useState } from "react";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useNavigate } from "react-router-dom";
import { mockGroups, Member } from "@/lib/courseMock";
import { v4 as uuidv4 } from "uuid";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([{ id: "", role: "student" }]);

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value;
    setMembers(next);
  };

  const addRow = () => setMembers([...members, { id: "", role: "student" }]);

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "student" }] : next);
  };

  const addBatchRows = (batch: { id: string; role: string }[]) => {
    setMembers((prev) => [...prev, ...batch]);
  };

  const handleSubmit = () => {
    const newGroupId = uuidv4().slice(0, 8);
    const newMembers: Member[] = members.map((m, idx) => ({
      id: `m${Date.now()}_${idx}`,
      username: "", // optional init
      email: m.id.includes("@") ? m.id : "",
      studentId: m.id.includes("@") ? "" : m.id,
      dept: "CS",
      role: m.role as Member["role"],
      accessLevel: "user",
    }));

    mockGroups.push({
      id: newGroupId,
      title,
      description,
      isArchived: false,
      members: newMembers,
    });
    navigate("/");
    // navigate(`/group/${newGroupId}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Group Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter group title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Say something about this group"
        />
      </div>

      {/* Add Members */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Add New Members</h2>
        <table className="w-full text-left text-sm border-t border-gray-200">
          <thead className="text-gray-500">
            <tr>
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
                onAddBatch={addBatchRows}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}
