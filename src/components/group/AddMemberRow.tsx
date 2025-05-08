import { CircleMinus, CirclePlus } from "lucide-react";

type Props = {
  index: number;
  id: string;
  role: string;
  isLast: boolean;
  onAddBatch: (newMembers: { id: string; role: string }[]) => void;
  onChange: (index: number, key: "id" | "role", value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
};

export default function AddMemberRow({
  index,
  id,
  role,
  isLast,
  onChange,
  onRemove,
  onAdd,
  onAddBatch,
}: Props) {
  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2">
        <input
          type="text"
          value={id}
          placeholder="Enter StudentID or Email"
          className="w-full px-2 py-1 border rounded"
          onChange={(e) => onChange(index, "id", e.target.value)}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");

            const rows = pasted
              .split("\n")
              .map((r) => r.trim())
              .filter(Boolean);
            console.log("Parsed rows:", rows);

            if (rows.length > 1) {
              e.preventDefault();
              const newMembers = rows.map((r) => ({ id: r, role: "Student" }));
              // console.log(" Members to add:", newMembers);
              onAddBatch(newMembers);
            }
          }}
        />
      </td>
      <td className="py-2">
        <select
          value={role}
          className="w-full px-2 py-1 border rounded"
          onChange={(e) => onChange(index, "role", e.target.value)}
        >
          <option value="Student">Student</option>
          <option value="TA">TA</option>
          <option value="Teacher">Teacher</option>
        </select>
      </td>
      <td className="py-2 text-center">
        {isLast ? (
          <button
            onClick={onAdd}
            className="p-1 text-gray-600 hover:text-black"
          >
            <CirclePlus size={16} />
          </button>
        ) : (
          <button
            onClick={() => onRemove(index)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <CircleMinus size={16} />
          </button>
        )}
      </td>
    </tr>
  );
}
