import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaginationControls from "@/components/PaginationControl";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useUpdateGlobalRole } from "@/hooks/useUpdateGlobalRole";
import UserConfigRow from "@/components/admin/UserConfigRow";
import { GLOBAL_ROLE_OPTIONS, type GlobalRole } from "@/types/admin";

export default function UserConfigTable() {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<GlobalRole | "">("");

  const currentRoleLabel = GLOBAL_ROLE_OPTIONS.find(
    (r) => r.id === roleFilter,
  )?.label;

  const { data, isLoading, isError } = useGetUsers({
    page: currentPage,
    size: resultsPerPage,
    search: searchQuery,
    role: roleFilter,
    sortBy: "fullName",
    sort: "asc",
  });
  const users = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const {
    mutate: updateRole,
    isPending: isUpdating,
    variables,
  } = useUpdateGlobalRole();

  const handleRoleUpdate = (userId: string, newRole: GlobalRole) => {
    updateRole({ id: userId, role: newRole });
  };

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
              {roleFilter ? `Role: ${currentRoleLabel}` : "Role"}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {GLOBAL_ROLE_OPTIONS.map((role) => (
              <DropdownMenuCheckboxItem
                key={role.id}
                checked={role.id === currentRoleLabel}
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
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {t("userConfigTable.cardTitle")}
            </h3>
          </div>
          {isLoading ? (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("userConfigTable.loadingUsers")}
            </div>
          ) : isError ? (
            <p className="text-sm text-red-500">
              {t("userConfigTable.failedToLoadUsers")}
            </p>
          ) : users.length === 0 ? (
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
                      onUpdateRole={(newRole) =>
                        handleRoleUpdate(user.id, newRole)
                      }
                      isPending={isUpdating && variables?.id === user.id}
                    />
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-between items-center">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
                <div>
                  <div className="flex justify-between items-center gap-2">
                    <p>Result per page:</p>
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
