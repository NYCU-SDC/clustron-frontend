import { CircleMinus, CirclePlus } from "lucide-react";
import { type GlobalRole, type GroupRoleAccessLevel } from "@/lib/permission";
import { useRoleMapper } from "@/hooks/useRoleMapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  // AccessLevelAdmin,
  // AccessLevelOwner,
  GroupMemberRoleName,
  AccessLevelUser,
} from "@/types/group";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  id: string;
  role: string;
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
  accessLevel = AccessLevelUser,
}: Props) {
  const { getRolesByAccessLevel } = useRoleMapper();

  const assignableRoles = getRolesByAccessLevel(accessLevel);
  console.log(assignableRoles);
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
                role: assignableRoles[0]?.roleName ?? "",
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
          onValueChange={(value) =>
            onChange(index, "role", value as GroupMemberRoleName)
          }
        >
          <SelectTrigger className="h-10 w-full text-sm">
            <SelectValue>
              {assignableRoles[0]?.roleName ?? "Select Role"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {assignableRoles.map((r) => (
              <SelectItem key={r.id} value={r.roleName}>
                {r.roleName}
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
