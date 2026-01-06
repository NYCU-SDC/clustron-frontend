import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
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

  const memberStatuses = members.map((member) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("groupPages.addMemberResult.createGroupResultTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/10 text-gray-500 dark:text-white">
                {t("groupPages.addMemberResult.studentIdOrEmail")}
              </TableHead>
              <TableHead className="w-1/10 text-gray-500 dark:text-white">
                {t("groupPages.addMemberResult.role")}
              </TableHead>
              <TableHead className="w-min text-center text-gray-500 dark:text-white">
                {t("groupPages.addMemberResult.status")}
              </TableHead>
              <TableHead className=" text-gray-500 dark:text-white">
                {t("groupPages.addMemberResult.additionalInfo")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberStatuses.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.member}</TableCell>
                <TableCell>{member.roleName}</TableCell>
                <TableCell className="flex justify-center">
                  <StatusIcon type={member.status} />
                </TableCell>
                <TableCell>{member.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
