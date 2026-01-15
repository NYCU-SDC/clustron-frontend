import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
// import { getUsers } from "@/lib/request/getUsers";
import {
  GLOBAL_ROLE_OPTIONS,
  type GlobalRole,
  type User,
  type GetUsersResponse,
  type GetUsersParams,
  type UpdateUserRoleInput,
  GlobalRoleUser,
  GlobalRoleOrganizer,
  GlobalRoleAdmin,
} from "@/types/admin";
// import { useGetUsers } from "@/hooks/useGetUsers";
// import { useUpdateGlobalRole } from "@/hooks/useUpdateGlobalRole";

// TODO: Remove mock data when backend is ready
const roles: GlobalRole[] = [
  GlobalRoleUser,
  GlobalRoleOrganizer,
  GlobalRoleAdmin,
];
const firstNames = [
  "王",
  "陳",
  "李",
  "張",
  "林",
  "James",
  "Alice",
  "Robert",
  "Grace",
  "Kevin",
];
const lastNames = [
  "小明",
  "志強",
  "雅婷",
  "美惠",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Lee",
];

const MOCK_GLOBAL_USERS: User[] = Array.from({ length: 50 }).map((_, index) => {
  const id = `uuid-${index + 1}`;
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const fullName = `${firstName}${lastName}`;
  const studentId = index % 7 === 0 ? "" : (110000000 + index).toString();

  return {
    id,
    fullName,
    studentId,
    email: `${id}@example.com`,
    role: roles[index % roles.length],
  };
});

const getMockUsers = async (
  params: GetUsersParams,
): Promise<GetUsersResponse> => {
  const { page = 0, size = 20, search = "", role = "" } = params;

  const filtered = MOCK_GLOBAL_USERS.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.studentId.includes(search);
    const matchesRole = role === "" || user.role === role;
    return matchesSearch && matchesRole;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: size,
    hasNextPage: page < totalPages,
  };
};

export default function UserConfigTable() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
    // queryFn: () => getUsers(params),
    queryFn: () =>
      getMockUsers({
        page: currentPage,
        size: resultsPerPage,
        search: searchQuery,
        role: roleFilter,
        sortBy: "fullName",
        sort: "asc",
      }),
    placeholderData: (prev) => prev,
  });
  const users = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const {
    mutate: updateRole,
    isPending: isUpdating,
    variables,
  } = useMutation({
    mutationFn: (input: UpdateUserRoleInput) => updateGlobalRole(input),
    onMutate: (input) => {
      const toastId = `update-global-role-${input.id}`;
      toast.loading(t("userConfigTable.updatingToast", "Updating..."), {
        id: toastId,
      });
      return toastId;
    },
    onSuccess: (_data, _vars, ctx) => {
      toast.success(t("userConfigTable.updateSuccessToast", "Role updated"), {
        id: ctx,
      });
      queryClient.invalidateQueries({ queryKey: ["AdminUsers"] });
    },
    onError: (err, _vars, ctx) => {
      toast.error(err instanceof Error ? err.message : "Failed", { id: ctx });
    },
  });

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
