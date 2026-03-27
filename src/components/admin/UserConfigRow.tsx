import { useState, useRef, useEffect } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  GLOBAL_ROLE_OPTIONS,
  GlobalRoleNotSetup,
  UpdateLinuxUsernameInput,
  type UpdateUserRoleInput,
  type GlobalRole,
} from "@/types/admin";

type Props = {
  name: string;
  id: string;
  email: string;
  linuxUsername: string;
  currentRole: GlobalRole;
  onUpdateRole: (newRole: UpdateUserRoleInput["role"]) => void;
  onUpdateLinuxUsername: (
    newUsername: UpdateLinuxUsernameInput["linuxUsername"],
  ) => Promise<void>;
  isOnBoarding?: boolean;
  isPending?: boolean;
  isSelf?: boolean;
};

export default function UserConfigRow({
  name,
  id,
  email,
  linuxUsername,
  currentRole,
  onUpdateRole,
  onUpdateLinuxUsername,
  isOnBoarding = false,
  isPending = false,
  isSelf = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(linuxUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(linuxUsername);
  }, [linuxUsername]);

  const startEditing = () => {
    setEditValue(linuxUsername);
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    if (editValue === linuxUsername) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateLinuxUsername(editValue);
    } catch (error) {
      console.error("Error updating Linux username:", error);
    } finally {
      setIsEditing(false);
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(linuxUsername);
    }
  };
  const roleLabel =
    GLOBAL_ROLE_OPTIONS.find((r) => r.id === currentRole)?.label || currentRole;

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium max-w-0">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate cursor-default">{name}</p>
              </TooltipTrigger>
              <TooltipContent className="max-w-[40vw] break-words">
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isSelf && (
            <span className="text-[10px] ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">
              YOU
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{id}</span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      </TableCell>
      <TableCell className="min-w-[200px]">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => !isSubmitting && setIsEditing(false)}
              className="h-8 py-1 font-mono text-sm w-32"
              disabled={isSubmitting}
            />
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span
              className="font-bold font-mono text-black cursor-pointer hover:bg-muted px-1 rounded transition-colors"
              onClick={startEditing}
            >
              {linuxUsername}
            </span>
            <Link2
              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
              onClick={startEditing}
            />
          </div>
        )}
      </TableCell>
      <TableCell>
        {isPending ? (
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isSelf || isOnBoarding}>
              <Button
                variant="ghost"
                className="flex items-center gap-1 font-medium text-sm p-0 h-8 has-[>svg]:px-0 hover:bg-muted"
              >
                {roleLabel}
                {!isOnBoarding && !isSelf && (
                  <ChevronDown className="w-4 h-4 opacity-50" />
                )}
              </Button>
            </DropdownMenuTrigger>
            {!isOnBoarding && !isSelf && (
              <DropdownMenuContent align="start">
                {GLOBAL_ROLE_OPTIONS.filter(
                  (role) => role.id !== GlobalRoleNotSetup,
                ).map((role) => (
                  <DropdownMenuCheckboxItem
                    key={role.id}
                    checked={role.id === currentRole}
                    onCheckedChange={() =>
                      onUpdateRole(role.id as UpdateUserRoleInput["role"])
                    }
                  >
                    {role.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
