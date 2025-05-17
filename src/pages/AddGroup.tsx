import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddMemberRow from "@/components/group/AddMemberRow";
import { useUserContext } from "@/context/UserContext";
import { useCreateGroup } from "@/hooks/useCreateGroup";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const currentUserRole = user?.role || "Student";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([{ id: "", role: "Student" }]);
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: createGroup, isPending } = useCreateGroup({
    onSuccess: () => navigate("/groups"),

    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "建立失敗，請稍後再試";
      setErrorMsg(message);
    },
  });

  const updateRow = (index: number, key: "id" | "role", value: string) => {
    const next = [...members];
    next[index][key] = value;
    setMembers(next);
  };

  const addRow = () => {
    setMembers([...members, { id: "", role: "Student" }]);
  };

  const removeRow = (index: number) => {
    const next = members.filter((_, i) => i !== index);
    setMembers(next.length === 0 ? [{ id: "", role: "Student" }] : next);
  };

  const addBatchRows = (batch: { id: string; role: string }[]) => {
    setMembers((prev) => [...prev, ...batch]);
  };

  const handleSubmit = () => {
    setErrorMsg("");

    const hasEmpty = members.some((m) => !m.id.trim() || !m.role);
    const isDuplicate = members.some(
      (m, i) => members.findIndex((n) => n.id.trim() === m.id.trim()) !== i,
    );

    if (!title.trim()) {
      setErrorMsg("請輸入課程名稱");
      return;
    }
    if (hasEmpty) {
      setErrorMsg("請填寫所有成員欄位");
      return;
    }
    if (isDuplicate) {
      setErrorMsg("有重複的成員 ID 或 Email");
      return;
    }

    createGroup({
      title,
      description,
      members: members.map((m) => ({
        member: m.id.trim(),
        role: m.role,
      })),
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Group Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter group title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Say something about this group"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Add New Members</h2>
        <table className="w-full text-left text-sm border-t border-gray-200">
          <thead className="text-gray-500">
            <tr>
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
                  isDuplicate={isDuplicate}
                />
              );
            })}
          </tbody>
        </table>
        {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
      </div>

      <div className="text-right">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`bg-gray-900 text-white px-4 py-2 rounded ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? "Saving..." : "Create Group"}
        </button>
      </div>
    </div>
  );
}
