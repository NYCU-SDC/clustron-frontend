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
import { GroupMemberRoleName } from "@/types/group";
import { cn } from "@/lib/utils";
import { AccessLevelUser } from "@/types/group";
import { useTranslation } from "react-i18next";

type Props = {
  index: number;
  id: string;
  roleName: string;
  isLast: boolean;
  isDuplicate?: boolean;
  disabled?: boolean;
  isPending?: boolean;
  onAddBatch: (
    newMembers: { id: string; roleName: GroupMemberRoleName }[],
  ) => void;
  onChange: (index: number, key: "id" | "roleName", value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  accessLevel?: GroupRoleAccessLevel;
  globalRole?: GlobalRole;
};

export default function AddMemberRow({
  index,
  id,
  roleName,
  isLast,
  isDuplicate,
  disabled = false,
  isPending = false,
  onAddBatch,
  onChange,
  onRemove,
  onAdd,
  accessLevel = AccessLevelUser,
}: Props) {
  const { t } = useTranslation();
  const { getRolesByAccessLevel } = useRoleMapper();

  const assignableRoles = getRolesByAccessLevel(accessLevel);
  // console.log(assignableRoles);
  const isInputDisabled = disabled || isPending;
  return (
    <tr className={`hover:bg-muted ${isPending ? "opacity-50" : ""}`}>
      <td className="py-2 px-2">
        <Input
          value={id}
          disabled={isInputDisabled}
          placeholder={t("groupComponents.addMemberRow.enterStudentIdOrEmail")}
          className={cn(
            "h-10 w-full text-sm",
            isDuplicate && "border-red-500 bg-red-50",
          )}
          onChange={(e) => onChange(index, "id", e.target.value)}
          title={
            isDuplicate ? t("groupComponents.addMemberRow.duplicateEntry") : ""
          }
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
                roleName: assignableRoles[0]?.roleName ?? "",
              }));
              onAddBatch(newMembers);
            }
          }}
        />
      </td>

      <td className="py-2 px-2">
        <Select
          value={roleName}
          disabled={isInputDisabled}
          onValueChange={(value) =>
            onChange(index, "roleName", value as GroupMemberRoleName)
          }
        >
          <SelectTrigger className="h-10 w-full text-sm">
            <SelectValue placeholder="Select Role" />
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
            disabled={isInputDisabled}
            className="text-gray-600 hover:text-black"
          >
            <CirclePlus size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            disabled={isInputDisabled}
            className="text-red-600 hover:text-red-800"
          >
            <CircleMinus size={16} />
          </Button>
        )}
      </td>
    </tr>
  );
}
