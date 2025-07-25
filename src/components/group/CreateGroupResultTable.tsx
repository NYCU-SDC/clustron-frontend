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
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import type { CreateGroupResultData } from "@/types/group";

const StatusIcon = ({ type }: { type: "success" | "warning" | "error" }) => {
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
    case "warning":
      return (
        <svg
          {...iconProps}
          fill="#f4bb77"
          stroke="#f4bb77"
          strokeWidth="2"
          className="lucide lucide-dot-icon lucide-dot"
        >
          <circle cx="12.1" cy="12.1" r="4" />
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

interface CreateGroupResultTableProps {
  result: CreateGroupResultData;
  members: { member: string; roleName: string }[];
}

export default function CreateGroupResultTable({
  result,
  members,
}: CreateGroupResultTableProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        message: t("groupPages.addMemberResult.successMessage"),
      };
    }
  });

  const handleBackClick = () => {
    navigate(`/groups`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("groupPages.addMemberResult.createGroupResultTitle")}
        </CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {t("groupPages.addMemberResult.successCount")}:{" "}
          {result.addedSuccessNumber} |{" "}
          {t("groupPages.addMemberResult.failureCount")}:{" "}
          {result.addedFailureNumber}
        </div>
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

        <div className="flex justify-center mt-6">
          <Button onClick={handleBackClick} className="px-6 py-2">
            {t("groupPages.addMemberResult.backToGroupList")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
