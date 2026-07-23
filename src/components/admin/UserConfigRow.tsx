import { useState, useRef, type ReactNode } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, Link2, Loader2, MoreHorizontal } from "lucide-react";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  GLOBAL_ROLE_OPTIONS,
  GlobalRoleNotSetup,
  type UpdateUserRoleInput,
  type GlobalRole,
} from "@/types/admin";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  id: string;
  email: string;
  linuxUsername: string;
  currentRole: GlobalRole;
  onUpdateRole: (newRole: UpdateUserRoleInput["role"]) => void;
  onUpdateLinuxUsername: (
    newUsername: string,
    options?: { onSettled?: () => void },
  ) => void;
  isOnBoarding?: boolean;
  isPending?: boolean;
  isSelf?: boolean;
};

function getRoleLabel(role: GlobalRole) {
  return GLOBAL_ROLE_OPTIONS.find((r) => r.id === role)?.label || role;
}

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
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditValue(linuxUsername);
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (editValue === linuxUsername) {
      setIsEditing(false);
      return;
    }
    onUpdateLinuxUsername(editValue, {
      onSettled: () => {
        setIsEditing(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(linuxUsername);
    }
  };
  const roleLabel = getRoleLabel(currentRole);

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium w-[20%] max-w-0">
        <div className="flex items-center min-w-0">
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
            <span className="text-[10px] ml-2 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold shrink-0">
              YOU
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-muted-foreground min-w-0 sm:hidden">
          <p className="truncate" title={id}>
            {id}
          </p>
          <p className="truncate" title={email}>
            {email}
          </p>
        </div>
      </TableCell>
      <TableCell className="max-w-0 hidden sm:table-cell">
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate" title={id}>
            {id}
          </p>
          <p className="text-sm text-muted-foreground truncate" title={email}>
            {email}
          </p>
        </div>
      </TableCell>
      <TableCell className="w-[30%] min-w-[200px] max-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => !isPending && setIsEditing(false)}
              className="h-8 py-1 text-sm w-32"
              disabled={isPending}
            />
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 group min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className="truncate text-foreground cursor-pointer hover:bg-muted px-1 rounded transition-colors"
                    onClick={startEditing}
                  >
                    {linuxUsername}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[40vw] break-words">
                  <p>{linuxUsername}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link2
              className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary shrink-0"
              onClick={startEditing}
            />
          </div>
        )}
      </TableCell>
      <TableCell className="w-[20%]">
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

function MobileDetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="min-w-0 text-right text-sm font-medium">{children}</div>
    </div>
  );
}

export function UserConfigMobileRow({
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
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState(linuxUsername);
  const { t } = useTranslation();

  const identifier = id || email;
  const roleLabel = getRoleLabel(currentRole);
  const canUpdateRole = !isSelf && !isOnBoarding;
  const canSaveUsername = editValue !== linuxUsername && !isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setEditValue(linuxUsername);
    }
  };

  const handleUsernameSubmit = () => {
    if (!canSaveUsername) return;

    onUpdateLinuxUsername(editValue, {
      onSettled: () => {
        setEditValue(editValue);
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerTrigger
        render={
          <button
            type="button"
            className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-muted/50"
          />
        }
      >
        <>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {identifier}
            </span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {name}
            </span>
          </span>
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
            {roleLabel}
          </span>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          )}
        </>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl">{name}</DrawerTitle>
          <DrawerDescription className="break-all">
            {identifier}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-2">
          <div className="overflow-hidden rounded-lg border">
            <MobileDetailRow label={t("userConfigTable.tableHeadName")}>
              <span className="break-words">{name}</span>
            </MobileDetailRow>
            <MobileDetailRow label={t("userConfigTable.drawerStudentId")}>
              <span className="break-all">{id || "-"}</span>
            </MobileDetailRow>
            <MobileDetailRow label={t("userConfigTable.drawerEmail")}>
              <span className="break-all">{email || "-"}</span>
            </MobileDetailRow>
            <MobileDetailRow
              label={t("userConfigTable.tableHeadLinuxUsername")}
            >
              <Input
                value={editValue}
                disabled={isPending}
                className="h-8 w-40 text-right text-sm"
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUsernameSubmit();
                  }
                }}
              />
            </MobileDetailRow>
            <MobileDetailRow label={t("userConfigTable.tableHeadRole")}>
              {canUpdateRole ? (
                <Select
                  value={currentRole}
                  disabled={isPending}
                  onValueChange={(value) =>
                    onUpdateRole(value as UpdateUserRoleInput["role"])
                  }
                >
                  <SelectTrigger
                    size="sm"
                    className="h-8 w-36 justify-end border-none bg-muted px-2 text-sm font-medium shadow-none hover:cursor-pointer focus-visible:ring-0"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GLOBAL_ROLE_OPTIONS.filter(
                      (role) => role.id !== GlobalRoleNotSetup,
                    ).map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                  {roleLabel}
                </span>
              )}
            </MobileDetailRow>
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleUsernameSubmit}
            disabled={!canSaveUsername}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("userConfigTable.updatingToast")}
              </>
            ) : (
              t("userConfigTable.drawerSaveLinuxUsername")
            )}
          </Button>
          <DrawerClose render={<Button variant="outline" className="w-full" />}>
            {t("userConfigTable.drawerClose")}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
