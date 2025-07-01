import { CircleMinus, CirclePlus, Loader2 } from "lucide-react";
import {
  assignableRolesMap,
  roleLabelMap,
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
import {
  AccessLevelAdmin,
  AccessLevelOwner,
  GroupMemberRoleName,
} from "@/types/group";
import { cn } from "@/lib/utils";
import { AccessLevelUser } from "@/types/group";
import { useTranslation } from "react-i18next";

type Props = {
  index: number;
  id: string;
  role: GroupMemberRoleName;
  isLast: boolean;
  isDuplicate?: boolean;
  disabled?: boolean;
  isPending?: boolean;
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
  isPending = false,
  onAddBatch,
  onChange,
  onRemove,
  onAdd,
  accessLevel = AccessLevelUser,
}: Props) {
  const { t } = useTranslation();
  const resolvedAccessLevel: GroupRoleAccessLevel = AccessLevelAdmin
    ? AccessLevelOwner
    : accessLevel;

  const assignableRoles =
    assignableRolesMap[
      resolvedAccessLevel as keyof typeof assignableRolesMap
    ] ?? [];

  const isInputDisabled = disabled || isPending;

  // for role i18n
  const getRoleLabel = (roleName: GroupMemberRoleName) => {
    return (
      t(`groupComponents.roles.${roleName}`) ||
      roleLabelMap[roleName] ||
      roleName
    );
  };

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
                role: assignableRoles[0] ?? "student",
              }));
              onAddBatch(newMembers);
            }
          }}
        />
      </td>

      <td className="py-2 px-2">
        <Select
          value={role}
          disabled={isInputDisabled}
          onValueChange={(value) =>
            onChange(index, "role", value as GroupMemberRoleName)
          }
        >
          <SelectTrigger className="h-10 w-full text-sm">
            <SelectValue>
              {getRoleLabel(role) ??
                t("groupComponents.addMemberRow.selectRole")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {assignableRoles.map((r) => (
              <SelectItem key={r} value={r}>
                {getRoleLabel(r)}
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
