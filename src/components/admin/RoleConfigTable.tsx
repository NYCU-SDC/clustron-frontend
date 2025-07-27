import { useState, useEffect } from "react";
import { CircleMinus, CirclePlus, Loader2Icon } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  type GroupMemberRoleName,
  AccessLevels,
  type GroupRoleAccessLevel,
  type RoleConfigInput,
} from "@/types/group";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleConfigs } from "@/lib/request/getRoleConfigs";
import { createRoleConfig } from "@/lib/request/createRoleConfig";
import { updateRoleConfig } from "@/lib/request/updateRoleConfig";
import { removeRoleConfig } from "@/lib/request/removeRoleConfig";

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

  const createMutation = useMutation({
    mutationFn: (payload: RoleConfigInput) => createRoleConfig(payload),
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
    mutationFn: ({ id, payload }: { id: string; payload: RoleConfigInput }) =>
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
    } else {
      console.log(roleConfigs);
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

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl">
            {t("roleConfigTable.cardTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  {t("roleConfigTable.tableHeadRole")}
                </TableHead>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  {t("roleConfigTable.tableHeadAccess")}
                </TableHead>
                <TableHead className="py-4 px-4"></TableHead>
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
                    <TableRow key={role.id} className="hover:bg-muted">
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
                          <SelectTrigger className="px-2 py-1 text-sm font-medium rounded-xl border-none bg-gray-100 dark:bg-gray-700 hover:cursor-pointer">
                            <SelectValue
                              placeholder={t(
                                "roleConfigTable.placeholderSelectAccess",
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {AccessLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
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
                          className="text-gray-600 hover:text-red-600 hover:cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          <CircleMinus size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

              <TableRow>
                <TableCell className="py-4 px-4">
                  <Input
                    value={newRole.roleName}
                    placeholder={t("roleConfigTable.placeholderRoleName")}
                    className="border-none shadow-none focus-visible:ring-0 p-0 dark:bg-transparent"
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
                    <SelectTrigger className="px-2 py-1 text-sm shadow-none font-medium rounded-xl dark:bg-transparent border-none hover:cursor-pointer">
                      <SelectValue
                        placeholder={t(
                          "roleConfigTable.placeholderSelectAccess",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {AccessLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  {createMutation.isPending ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      className="text-gray-600"
                    >
                      <Loader2Icon className="animate-spin" size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddRole}
                      className="text-gray-600 hover:text-green-600 hover:cursor-pointer"
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
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteRoleId}
        onOpenChange={() => setDeleteRoleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              {t("roleConfigTable.confirmTitle")}
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
              {t("roleConfigTable.cancelBtn")}
            </AlertDialogCancel>
            {deleteMutation.isPending ? (
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive disabled:cursor-not-allowed"
                disabled
              >
                <Loader2Icon className="animate-spin mr-2" size={16} />
                {t("roleConfigTable.removingBtn")}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={confirmRemoveRole}
                className="cursor-pointer bg-destructive hover:bg-destructive"
              >
                {t("roleConfigTable.removeBtn")}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
