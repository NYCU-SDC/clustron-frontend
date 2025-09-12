import { CircleMinus, CirclePlus } from "lucide-react";
import { GlobalRole, type GroupRoleAccessLevel } from "@/lib/permission";
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
import { AccessLevelOwner, GroupMemberRoleName } from "@/types/group";
import { cn } from "@/lib/utils";
import { AccessLevelUser } from "@/types/group";
import { useTranslation } from "react-i18next";
import { useUserAutocomplete } from "@/hooks/useUserAutocomplete";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

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
  globalRole,
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
  const { query, setQuery, suggestions, showSuggestions, handleSelect } =
    useUserAutocomplete<{ identifier: string }>();

  const effectiveAccessLevel =
    globalRole === "admin" ? AccessLevelOwner : accessLevel;

  const assignableRoles = getRolesByAccessLevel(effectiveAccessLevel);
  const isInputDisabled = disabled || isPending;

  console.log({ query, showSuggestions, suggestions });

  return (
    <tr className={`hover:bg-muted ${isPending ? "opacity-50" : ""}`}>
      <td className="py-2 px-2">
        {/* ✅ Wrapper div for relative positioning */}
        <div style={{ position: "relative" }}>
          <Input
            value={query || id}
            disabled={isInputDisabled}
            placeholder={t(
              "groupComponents.addMemberRow.enterStudentIdOrEmail",
            )}
            className={cn(
              "h-10 w-full text-sm",
              isDuplicate && "border-red-500 bg-red-50",
            )}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(index, "id", e.target.value);
            }}
            title={
              isDuplicate
                ? t("groupComponents.addMemberRow.duplicateEntry")
                : ""
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

          {showSuggestions && suggestions.length > 0 && (
            <Command>
              <CommandList>
                {suggestions.map((user) => (
                  <CommandItem
                    key={user.identifier}
                    onSelect={() => {
                      handleSelect(user);
                      onChange(index, "id", user.identifier);
                    }}
                  >
                    {user.identifier}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          )}
        </div>
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
          </SelectTrigger>{" "}
          <SelectContent>
            {" "}
            {assignableRoles.map((r) => (
              <SelectItem key={r.id} value={r.roleName}>
                {r.roleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>{" "}
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
