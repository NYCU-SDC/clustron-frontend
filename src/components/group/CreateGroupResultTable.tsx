import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataTable,
  createDataTableColumnHelper,
} from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useNavigate } from "react-router";
import type { CreateGroupResultData } from "@/types/group";
import { ArrowRightFromLine } from "lucide-react";

const StatusIcon = ({ type }: { type: "success" | "error" }) => {
  const iconProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "success":
      return (
        <svg
          {...iconProps}
          fill="none"
          stroke="#5bc65f"
          className="lucide lucide-check-icon lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "error":
      return (
        <svg
          {...iconProps}
          fill="none"
          stroke="#ea3d5a"
          className="lucide lucide-x-icon lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
  }
};

type MemberStatus = {
  member: string;
  roleName: string;
  status: "success" | "error";
  message: string;
};

const helper = createDataTableColumnHelper<MemberStatus>();

const HEAD_CLASS = "text-gray-500 dark:text-white";

function getColumns(t: TFunction) {
  return helper.columns([
    helper.accessor("member", {
      header: t("groupPages.addMemberResult.studentIdOrEmail"),
      meta: { headClassName: `w-3/10 ${HEAD_CLASS}` },
    }),
    helper.accessor("roleName", {
      header: t("groupPages.addMemberResult.role"),
      meta: { headClassName: `w-1/10 ${HEAD_CLASS}` },
    }),
    helper.accessor("status", {
      header: t("groupPages.addMemberResult.status"),
      meta: {
        headClassName: `w-min text-center ${HEAD_CLASS}`,
        cellClassName: "text-center",
      },
      cell: ({ getValue }) => (
        <span className="inline-flex justify-center">
          <StatusIcon type={getValue()} />
        </span>
      ),
    }),
    helper.accessor("message", {
      header: t("groupPages.addMemberResult.additionalInfo"),
      meta: {
        headClassName: HEAD_CLASS,
        cellClassName: "max-w-[280px] whitespace-normal",
      },
    }),
  ]);
}

export default function CreateGroupResultTable({
  result,
  members,
  groupId,
}: {
  result: CreateGroupResultData;
  members: { member: string; roleName: string }[];
  groupId?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = useMemo(() => getColumns(t), [t]);

  const memberStatuses: MemberStatus[] = members.map((member) => {
    const error = result.errors.find((err) => err.member === member.member);

    if (error) {
      return {
        ...member,
        status: "error" as const,
        message: error.message,
      };
    } else {
      return {
        ...member,
        status: "success" as const,
        message: "",
      };
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {t("groupPages.addMemberResult.createGroupResultTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={memberStatuses}
          className="min-w-3xl"
        />

        <div className="flex justify-center gap-8 mt-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex gap-2">
            <StatusIcon type="success" />
            <span>{t("groupPages.addMemberResult.successStatus")}</span>
          </div>
          <div className="flex gap-2">
            <StatusIcon type="error" />
            <span>{t("groupPages.addMemberResult.errorStatus")}</span>
          </div>
        </div>

        {groupId && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => navigate(`/groups/${groupId}`)}
              className="cursor-pointer"
              variant="secondary"
            >
              <ArrowRightFromLine />
              {t("groupPages.addMemberResult.goToGroupDetail")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
