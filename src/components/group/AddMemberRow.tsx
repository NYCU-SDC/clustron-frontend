import { CircleMinus, CirclePlus } from "lucide-react";
import {
  assignableRolesMap,
  type GlobalRole,
  type GroupRoleAccessLevel,
} from "@/lib/permission";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GroupMemberRoleName } from "@/types/group";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  id: string;
  role: GroupMemberRoleName;
  isLast: boolean;
  isDuplicate?: boolean;
  disabled?: boolean;
  onAddBatch: (newMembers: { id: string; role: GroupMemberRoleName }[]) => void;
  onChange: (index: number, key: "id" | "role", value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;

  accessLevel?: GroupRoleAccessLevel;
  globalRole?: GlobalRole;
};

export default function AddMemberRow({
  index,
  id,
  role,
  isLast,
  isDuplicate,
  disabled = false,
  onAddBatch,
  onChange,
  onRemove,
  onAdd,
  accessLevel = "USER", //TODO
  globalRole,
}: Props) {
  const isAdmin = globalRole === "admin";

  const resolvedAccessLevel: GroupRoleAccessLevel = isAdmin
    ? "GROUP_OWNER"
    : accessLevel;

  const assignableRoles = assignableRolesMap[resolvedAccessLevel] ?? [];

  return (
    <tr className="hover:bg-muted">
      <td className="py-2 px-2">
        <Input
          value={id}
          disabled={disabled}
          placeholder="Enter StudentID or Email"
          className={cn(
            "h-10 w-full text-sm",
            isDuplicate && "border-red-500 bg-red-50",
          )}
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
              const newMembers = rows.map((r) => ({
                id: r,
                role: "Student" as GroupMemberRoleName,
              }));
              onAddBatch(newMembers);
            }
          }}
        />
      </td>

      <td className="py-2 px-2">
        <Select
          value={role}
          disabled={disabled}
          onValueChange={(value) => onChange(index, "role", value)}
        >
          <SelectTrigger className="h-10 w-full text-sm">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {assignableRoles.map((r) => (
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
            disabled={disabled}
            className="text-gray-600 hover:text-black"
          >
            <CirclePlus size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            disabled={disabled}
            className="text-red-600 hover:text-red-800"
          >
            <CircleMinus size={16} />
          </Button>
        )}
      </td>
    </tr>
  );
}
