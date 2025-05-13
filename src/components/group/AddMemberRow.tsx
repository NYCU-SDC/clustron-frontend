import { CircleMinus, CirclePlus } from "lucide-react";
import { roleAssignableMap } from "@/lib/permission";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Props = {
  index: number;
  id: string;
  role: string;
  isLast: boolean;
  onAddBatch: (newMembers: { id: string; role: string }[]) => void;
  onChange: (index: number, key: "id" | "role", value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  currentUserRole: string;
  isDuplicate?: boolean;
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
  currentUserRole,
  isDuplicate,
}: Props) {
  return (
    <tr className="hover:bg-muted">
      <td className="py-2 px-2">
        <Input
          value={id}
          placeholder="Enter StudentID or Email"
          className={isDuplicate ? "border-red-500 bg-red-50" : ""}
          onChange={(e) => onChange(index, "id", e.target.value)}
          title={isDuplicate ? "Duplicate entry" : ""}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            const rows = pasted
              .split("\n")
              .map((r) => r.trim())
              .filter(Boolean);
            if (rows.length > 1) {
              e.preventDefault();
              const newMembers = rows.map((r) => ({ id: r, role: "Student" }));
              onAddBatch(newMembers);
            }
          }}
        />
      </td>

      <td className="py-2 px-2">
        <Select
          value={role}
          onValueChange={(value: string) => onChange(index, "role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roleAssignableMap[currentUserRole]?.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="py-2 px-2 text-center">
        {isLast ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAdd}
            className="text-gray-600 hover:text-black"
          >
            <CirclePlus size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800"
          >
            <CircleMinus size={16} />
          </Button>
        )}
      </td>
    </tr>
  );
}
