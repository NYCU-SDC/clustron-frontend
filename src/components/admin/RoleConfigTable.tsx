import { useEffect, useState, type ReactNode } from "react";
import {
  CircleMinus,
  CirclePlus,
  Info,
  Loader2Icon,
  TriangleAlert,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  type GroupMemberRoleName,
  AccessLevels,
  type GroupRole,
  type GroupRoleAccessLevel,
  type RoleConfigRequest,
} from "@/types/group";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleConfigs } from "@/lib/request/getRoleConfigs";
import { createRoleConfig } from "@/lib/request/createRoleConfig";
import { updateRoleConfig } from "@/lib/request/updateRoleConfig";
import { removeRoleConfig } from "@/lib/request/removeRoleConfig";

function MobileHeaderInfo({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label="More information"
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[260px] whitespace-normal text-sm"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const ACCESS_LEVEL_LABELS: Record<GroupRoleAccessLevel, string> = {
  USER: "User",
  GROUP_ADMIN: "Group-Admin",
  GROUP_OWNER: "Group-Owner",
};

export default function RoleConfigTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const ROLE_CONFIGS_QUERY_KEY = ["roleConfigs"] as const;

  const {
    data: roleConfigs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ROLE_CONFIGS_QUERY_KEY,
    queryFn: getRoleConfigs,
  });

  const [newRole, setNewRole] = useState<{
    roleName: string;
    accessLevel: GroupRoleAccessLevel | "";
  }>({
    roleName: "",
    accessLevel: "",
  });
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileEditingRoleId, setMobileEditingRoleId] = useState<string | null>(
    null,
  );
  const [mobileRoleName, setMobileRoleName] = useState("");
  const [mobileAccessLevel, setMobileAccessLevel] = useState<
    GroupRoleAccessLevel | ""
  >("");

  const createMutation = useMutation({
    mutationFn: (payload: RoleConfigRequest) => createRoleConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_CONFIGS_QUERY_KEY });
      toast.success(t("roleConfigTable.createSuccessToast"));
      setNewRole({ roleName: "", accessLevel: "" });
    },
    onError: (error: Error) => {
      if (error.name === "400") {
        toast.error(t("roleConfigTable.createDuplicateToast"));
      } else {
        toast.error(t("roleConfigTable.createFailToast"));
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RoleConfigRequest }) =>
      updateRoleConfig(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_CONFIGS_QUERY_KEY });
      toast.success(t("roleConfigTable.updateSuccessToast"));
    },
    onError: () => {
      toast.error(t("roleConfigTable.updateFailToast"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeRoleConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_CONFIGS_QUERY_KEY });
      toast.success(t("roleConfigTable.deleteSuccessToast"));
      setDeleteRoleId(null);
    },
    onError: () => {
      toast.error(t("roleConfigTable.deleteFailToast"));
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(t("roleConfigTable.loadFailToast"));
    }
  }, [isError, roleConfigs, t]);

  const handleAddRole = () => {
    if (newRole.roleName.trim() && newRole.accessLevel) {
      createMutation.mutate({
        role: newRole.roleName.trim() as GroupMemberRoleName,
        accessLevel: newRole.accessLevel,
      });
    }
  };

  const confirmRemoveRole = () => {
    if (deleteRoleId) {
      deleteMutation.mutate(deleteRoleId);
    }
  };

  const handleAccessLevelChange = (
    roleId: string,
    newAccessLevel: GroupRoleAccessLevel,
  ) => {
    const role = roleConfigs.find((r) => r.id === roleId);
    if (role) {
      updateMutation.mutate({
        id: roleId,
        payload: {
          role: role.roleName,
          accessLevel: newAccessLevel,
        },
      });
    }
  };

  const openCreateDrawer = () => {
    setMobileEditingRoleId(null);
    setMobileRoleName("");
    setMobileAccessLevel("");
    setMobileDrawerOpen(true);
  };

  const openEditDrawer = (role: GroupRole) => {
    setMobileEditingRoleId(role.id);
    setMobileRoleName(role.roleName);
    setMobileAccessLevel(role.accessLevel);
    setMobileDrawerOpen(true);
  };

  const handleDrawerDone = () => {
    if (!mobileRoleName.trim() || !mobileAccessLevel) return;

    if (mobileEditingRoleId) {
      updateMutation.mutate(
        {
          id: mobileEditingRoleId,
          payload: {
            role: mobileRoleName.trim() as GroupMemberRoleName,
            accessLevel: mobileAccessLevel,
          },
        },
        { onSuccess: () => setMobileDrawerOpen(false) },
      );
    } else {
      createMutation.mutate(
        {
          role: mobileRoleName.trim() as GroupMemberRoleName,
          accessLevel: mobileAccessLevel,
        },
        { onSuccess: () => setMobileDrawerOpen(false) },
      );
    }
  };

  const handleDrawerRemove = () => {
    if (!mobileEditingRoleId) return;
    setMobileDrawerOpen(false);
    setDeleteRoleId(mobileEditingRoleId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("roleConfigTable.cardTitle")}
          </CardTitle>
          <CardDescription>
            {t("roleConfigTable.cardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 px-4 align-top whitespace-normal">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {t("roleConfigTable.tableHeadRole")}
                    </span>

                    <MobileHeaderInfo>
                      <p>{t("roleConfigTable.tableHeadRoleDescription")}</p>
                    </MobileHeaderInfo>
                  </div>

                  <p className="hidden md:block text-muted-foreground mt-1 font-normal whitespace-normal">
                    {t("roleConfigTable.tableHeadRoleDescription")}
                  </p>
                </TableHead>

                <TableHead className="py-4 px-4 align-top whitespace-normal">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      <span className="md:hidden">
                        {t("roleConfigTable.tableHeadAccessMobile")}
                      </span>
                      <span className="hidden md:inline">
                        {t("roleConfigTable.tableHeadAccess")}
                      </span>
                    </span>

                    <MobileHeaderInfo>
                      <div className="space-y-2">
                        <p>{t("roleConfigTable.tableHeadAccessDescription")}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>
                            <strong>
                              {t("roleConfigTable.accessLevelGroupOwnerLabel")}:
                            </strong>{" "}
                            {t(
                              "roleConfigTable.accessLevelGroupOwnerDescription",
                            )}
                          </li>
                          <li>
                            <strong>
                              {t("roleConfigTable.accessLevelGroupAdminLabel")}:
                            </strong>{" "}
                            {t(
                              "roleConfigTable.accessLevelGroupAdminDescription",
                            )}
                          </li>
                          <li>
                            <strong>
                              {t("roleConfigTable.accessLevelUserLabel")}:
                            </strong>{" "}
                            {t("roleConfigTable.accessLevelUserDescription")}
                          </li>
                        </ul>
                      </div>
                    </MobileHeaderInfo>
                  </div>

                  <div className="hidden md:block text-muted-foreground mt-1 font-normal whitespace-normal">
                    <p>{t("roleConfigTable.tableHeadAccessDescription")}</p>
                    <ul className="mt-1 space-y-1">
                      <li>
                        <strong>
                          {t("roleConfigTable.accessLevelGroupOwnerLabel")}:
                        </strong>{" "}
                        {t("roleConfigTable.accessLevelGroupOwnerDescription")}
                      </li>
                      <li>
                        <strong>
                          {t("roleConfigTable.accessLevelGroupAdminLabel")}:
                        </strong>{" "}
                        {t("roleConfigTable.accessLevelGroupAdminDescription")}
                      </li>
                      <li>
                        <strong>
                          {t("roleConfigTable.accessLevelUserLabel")}:
                        </strong>{" "}
                        {t("roleConfigTable.accessLevelUserDescription")}
                      </li>
                    </ul>
                  </div>
                </TableHead>

                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : roleConfigs.map((role) => (
                    <TableRow
                      key={role.id}
                      className="hidden md:table-row hover:bg-muted"
                    >
                      <TableCell className="py-4 px-4">
                        {role.roleName}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Select
                          value={role.accessLevel}
                          onValueChange={(value: GroupRoleAccessLevel) =>
                            handleAccessLevelChange(role.id, value)
                          }
                          disabled={updateMutation.isPending}
                        >
                          <SelectTrigger
                            size="sm"
                            className="w-32 md:w-40 rounded-full border-none bg-gray-100 px-2 py-0 text-[13px] font-medium shadow-none hover:cursor-pointer [&>span]:text-[13px] [&>span]:leading-none"
                          >
                            <SelectValue
                              placeholder={t(
                                "roleConfigTable.placeholderSelectAccess",
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {AccessLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {ACCESS_LEVEL_LABELS[level]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteRoleId(role.id)}
                          className="hover:text-red-600 hover:cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          <CircleMinus size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

              {!isLoading &&
                roleConfigs.map((role) => (
                  <TableRow
                    key={`mobile-${role.id}`}
                    className="md:hidden cursor-pointer"
                    onClick={() => openEditDrawer(role)}
                  >
                    <TableCell className="py-4 px-4">{role.roleName}</TableCell>
                    <TableCell className="py-4 px-4" colSpan={2}>
                      <Badge variant="secondary" className="font-semibold">
                        {ACCESS_LEVEL_LABELS[role.accessLevel]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

              <TableRow className="hidden md:table-row">
                <TableCell className="py-4 px-4">
                  <Input
                    value={newRole.roleName}
                    placeholder={t("roleConfigTable.placeholderRoleName")}
                    className="h-8 rounded-none border-none p-0 text-sm font-medium shadow-none placeholder:text-sm focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent"
                    onChange={(e) =>
                      setNewRole({ ...newRole, roleName: e.target.value })
                    }
                    disabled={createMutation.isPending}
                  />
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Select
                    value={newRole.accessLevel}
                    onValueChange={(value: GroupRoleAccessLevel) =>
                      setNewRole({ ...newRole, accessLevel: value })
                    }
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-32 md:w-40 rounded-none border-none px-0 text-sm font-medium shadow-none hover:cursor-pointer dark:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 [&>span]:text-sm"
                    >
                      <SelectValue
                        placeholder={t(
                          "roleConfigTable.placeholderSelectAccess",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {AccessLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {ACCESS_LEVEL_LABELS[level]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  {createMutation.isPending ? (
                    <Button variant="ghost" size="icon" disabled>
                      <Loader2Icon className="animate-spin" size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddRole}
                      className="hover:text-green-600 hover:cursor-pointer"
                      disabled={
                        !newRole.roleName.trim() || !newRole.accessLevel
                      }
                    >
                      <CirclePlus size={16} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            type="button"
            onClick={openCreateDrawer}
            className="mt-4 w-full rounded-md md:hidden"
          >
            {t("roleConfigTable.addRoleBtn")}
          </Button>
        </CardContent>
      </Card>

      <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <DrawerContent
          side="bottom"
          className="md:hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader>
            <DrawerTitle>
              {mobileEditingRoleId
                ? t("roleConfigTable.tableHeadRole")
                : t("roleConfigTable.addRoleBtn")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("roleConfigTable.roleNameFieldLabel")}</Label>
              <Input
                value={mobileRoleName}
                placeholder={t("roleConfigTable.placeholderRoleName")}
                onChange={(e) => setMobileRoleName(e.target.value)}
                disabled={createMutation.isPending || updateMutation.isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("roleConfigTable.accessLevelFieldLabel")}</Label>
              <Select
                value={mobileAccessLevel}
                onValueChange={(value: GroupRoleAccessLevel) =>
                  setMobileAccessLevel(value)
                }
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("roleConfigTable.placeholderSelectAccess")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {AccessLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {ACCESS_LEVEL_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter>
            <Button
              onClick={handleDrawerDone}
              disabled={
                !mobileRoleName.trim() ||
                !mobileAccessLevel ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2Icon className="animate-spin" size={16} />
              ) : null}
              {t("roleConfigTable.doneBtn")}
            </Button>

            {mobileEditingRoleId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDrawerRemove}
                className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {t("roleConfigTable.removeRoleBtn")}
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        open={!!deleteRoleId}
        onOpenChange={() => setDeleteRoleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <TriangleAlert className="w-5 h-5" />
                {t("roleConfigTable.confirmTitle")}
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("roleConfigTable.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setDeleteRoleId(null)}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            {deleteMutation.isPending ? (
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive disabled:cursor-not-allowed"
                disabled
              >
                <Loader2Icon className="animate-spin mr-2" size={16} />
                {t("common.removing")}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={confirmRemoveRole}
                className="cursor-pointer bg-destructive hover:bg-destructive"
              >
                {t("common.remove")}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
