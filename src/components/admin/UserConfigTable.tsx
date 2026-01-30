import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationControls from "@/components/PaginationControl";
import UserConfigRow from "@/components/admin/UserConfigRow";
import { updateGlobalRole } from "@/lib/request/updateGlobalRole";
import { getUsers } from "@/lib/request/getUsers";
import {
  GLOBAL_ROLE_OPTIONS,
  type GlobalRole,
  type UpdateUserRoleInput,
} from "@/types/admin";

export default function UserConfigTable() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const payload = useJwtPayload();
  const currentUserId = payload?.ID;

  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<GlobalRole | "">("");

  const currentRoleLabel = roleFilter
    ? GLOBAL_ROLE_OPTIONS.find((r) => r.id === roleFilter)?.label
    : "All";

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "AdminUsers",
      currentPage,
      resultsPerPage,
      searchQuery,
      roleFilter,
    ],
    queryFn: () =>
      getUsers({
        page: currentPage,
        size: resultsPerPage,
        search: searchQuery,
        role: roleFilter,
        sortBy: "fullName",
        sort: "asc",
      }),
    placeholderData: (prev) => prev,
  });

  const {
    mutate: updateRole,
    isPending: isUpdating,
    variables,
  } = useMutation({
    mutationFn: (input: UpdateUserRoleInput) => updateGlobalRole(input),
    onMutate: (input) => {
      const toastId = `update-global-role-${input.id}`;
      toast.loading(t("userConfigTable.updatingToast"), {
        id: toastId,
      });
      return toastId;
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(t("userConfigTable.updateSuccessToast"), {
        id: ctx,
      });
      queryClient.invalidateQueries({ queryKey: ["AdminUsers"] });
    },
    onError: (_err, _vars, ctx) => {
      toast.error(t("userConfigTable.updateFailToast"), { id: ctx });
    },
  });

  const handleRoleUpdate = (
    userId: string,
    newRole: UpdateUserRoleInput["role"],
  ) => {
    updateRole({ id: userId, role: newRole });
  };

  if (isError) {
    return (
      <p className="text-sm text-red-500 p-10 text-center">
        {t("userConfigTable.failedToLoadUsers")}
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 gap-2 text-sm text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        {t("userConfigTable.loadingUsers")}
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-sm text-red-500 p-10 text-center">
        {t("userConfigTable.dataIsMissing")}
      </p>
    );
  }

  const users = data.items;
  const totalPages = data.totalPages;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("userConfigTable.searchPlaceholder")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 font-medium text-sm px-2 py-1 h-8 hover:bg-muted"
            >
              Role: {currentRoleLabel}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuCheckboxItem
              key="all"
              checked={roleFilter === ""}
              onCheckedChange={() => {
                setRoleFilter("");
                setCurrentPage(0);
              }}
            >
              All
            </DropdownMenuCheckboxItem>
            {GLOBAL_ROLE_OPTIONS.map((role) => (
              <DropdownMenuCheckboxItem
                key={role.id}
                checked={role.id === roleFilter}
                onCheckedChange={() => {
                  setRoleFilter(role.id);
                  setCurrentPage(0);
                }}
              >
                {role.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("userConfigTable.cardTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">
              {t("userConfigTable.noUsersFound")}
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("userConfigTable.tableHeadName")}</TableHead>
                    <TableHead>{t("userConfigTable.tableHeadId")}</TableHead>
                    <TableHead>{t("userConfigTable.tableHeadRole")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <UserConfigRow
                      key={user.id}
                      name={user.fullName}
                      id={user.studentId}
                      email={user.email}
                      currentRole={user.role}
                      isOnBoarding={user.role == "ROLE_NOT_SETUP"}
                      isSelf={user.id === currentUserId}
                      onUpdateRole={(newRole) =>
                        handleRoleUpdate(user.id, newRole)
                      }
                      isPending={isUpdating && variables?.id === user.id}
                    />
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center w-full">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
                <div className="mt-6 ml-auto">
                  <div className="flex justify-between items-center gap-2">
                    <p>{t("userConfigTable.resultPerPage")}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-1 font-medium text-sm px-2 py-1 h-8 hover:bg-muted"
                        >
                          {resultsPerPage}
                          <ChevronDown className="w-4 h-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {[20, 40, 80, 100].map((size) => (
                          <DropdownMenuItem
                            key={size}
                            onClick={() => {
                              setResultsPerPage(size);
                              setCurrentPage(0);
                            }}
                          >
                            {size}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
