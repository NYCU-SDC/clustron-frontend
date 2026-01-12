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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGetMembers } from "@/hooks/useGetMembers";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import AddMemberButton from "@/components/group/AddMemberButton";
import UserConfigRow from "@/components/admin/UserConfigRow";
import {
  GlobalRoleUser,
  GlobalRoleOrganizer,
  GlobalRoleAdmin,
  GLOBAL_ROLE_OPTIONS,
  User,
} from "@/types/admin";
import type { GlobalRole, GroupRoleAccessLevel } from "@/lib/permission";
import { AccessLevelUser } from "@/types/group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const MOCK_GLOBAL_USERS: User[] = [
  {
    id: "uuid-1",
    fullName: "王小明",
    studentId: "113999321",
    email: "liam@gmail.com",
    role: GlobalRoleUser,
  },
  {
    id: "uuid-2",
    fullName: "Olivia Smith",
    studentId: "",
    email: "olivia@gmail.com",
    role: GlobalRoleUser,
  },
  {
    id: "uuid-3",
    fullName: "陳小美",
    studentId: "110345678",
    email: "noah@gmail.com",
    role: GlobalRoleUser,
  },
  {
    id: "uuid-4",
    fullName: "Emma Brown",
    studentId: "111000111",
    email: "emma@gmail.com",
    role: GlobalRoleOrganizer,
  },
  {
    id: "uuid-5",
    fullName: "SDC",
    studentId: "",
    email: "admin@sdc.nycu.club",
    role: GlobalRoleAdmin,
  },
];
// 模擬一個 Hook，長得跟原本的 useGetMembers 一模一樣
const useMockGlobalUsers = (page: number) => {
  return {
    data: {
      items: MOCK_USERS_DATA,
      totalPages: 5, // 假裝有 5 頁
    },
    isLoading: false, // 假裝已經讀取完畢
    isError: false, // 假裝沒有錯誤
  };
};

type Props = {
  groupId: string;
  accessLevel?: GroupRoleAccessLevel;
  globalRole?: GlobalRole;
  onRemove?: (memberId: string) => void;
  isArchived?: boolean;
  isOverview?: boolean;
};

export default function UserConfigTable({
  groupId,
  accessLevel = AccessLevelUser,
  globalRole,
  onRemove,
  isArchived = false,
  isOverview = false,
}: Props) {
  const { t } = useTranslation();
  const payload = useJwtPayload();
  const effectiveGlobalRole = globalRole ?? (payload?.Role as GlobalRole);

  // 1. 強制讓你有編輯權限 (不然 Admin 進來按鈕會是灰的或不見)
  // const { canEditMembers } = getGroupPermissions(...);
  const canEditMembers = true;

  // const { canEditMembers } = getGroupPermissions(
  //   accessLevel,
  //   effectiveGlobalRole,
  // );
  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [currentRole, setCurrentRole] = useState("User");
  // 假裝 Loading 已經結束，沒有錯誤
  const isLoading = false;
  const isError = false;

  // 直接塞入假資料
  const members = MOCK_GLOBAL_USERS;
  const totalPages = 5; // 假裝有 5 頁

  // const { data, isLoading, isError } = useGetMembers(groupId, currentPage);
  // const members = data?.items ?? [];
  // const totalPages = data?.totalPages ?? 1;

  const {
    mutate: updateMember,
    isPending: isUpdatingMember,
    variables,
  } = useUpdateMember(groupId);

  const updateMemberRole = (memberId: string, newRoldId: string) => {
    if (!newRoldId) {
      console.error(`Invalid role `);
      return;
    }

    updateMember({
      memberId: memberId,
      groupId: groupId,
      roleId: newRoldId,
    });
  };

  const maxPages = 4;
  let startPage = Math.max(currentPage - 1, 0);
  let endPage = startPage + maxPages - 1;
  if (endPage >= totalPages) {
    endPage = totalPages - 1;
    startPage = Math.max(endPage - maxPages + 1, 0);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            // onChange={(e) => setSearch(e.target.value)} // 之後這裡接你的搜尋邏輯
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 font-medium text-sm px-2 py-1 h-8 hover:bg-muted"
            >
              Role: {currentRole}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {GLOBAL_ROLE_OPTIONS.map((role) => (
              <DropdownMenuCheckboxItem
                key={role.label}
                checked={role.label === currentRole}
                onCheckedChange={() => setCurrentRole(role.label)}
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
              {t("userConfigTable.loadingMembers")}
            </div>
          ) : isError ? (
            <p className="text-sm text-red-500">
              {t("userConfigTable.failedToLoadUsers")}
            </p>
          ) : members.length === 0 ? (
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
                  {members.map((m) => (
                    <UserConfigRow
                      key={m.id}
                      name={m.fullName}
                      id={m.studentId}
                      email={m.email}
                      currentRole={m.role}
                      // 這裡連接你之前寫好的 Mock Update function
                      onUpdateRole={(newRole) =>
                        updateMemberRole(m.id, newRole)
                      }
                      // 之後接上 API 可以用這個控制 loading
                      isPending={
                        isUpdatingMember && variables?.memberId === m.id
                      }
                    />
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-between items-center">
                <Pagination className="w-fit mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 0))
                        }
                        className={
                          currentPage === 0
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {startPage > 0 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}

                    {Array.from(
                      { length: endPage - startPage + 1 },
                      (_, i) => startPage + i,
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {endPage < totalPages - 1 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                        }
                        className={
                          currentPage === totalPages - 1
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
                            onClick={() => setResultsPerPage(size)}
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
