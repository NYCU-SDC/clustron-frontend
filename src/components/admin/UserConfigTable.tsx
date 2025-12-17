import { useState, useEffect } from "react";
import {
  CircleMinus,
  CirclePlus,
  Loader2Icon,
  TriangleAlert,
} from "lucide-react";
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

export default function UserConfigTable() {
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
    console.log("ID", roleId);
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
            {t("userConfigTable.cardTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  {t("userConfigTable.tableHeadName")}
                </TableHead>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  {t("userConfigTable.tableHeadId")}
                </TableHead>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  {t("userConfigTable.tableHeadRole")}
                </TableHead>
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
                          className="hover:text-red-600 hover:cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          <CircleMinus size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
