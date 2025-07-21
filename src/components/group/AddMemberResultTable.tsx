import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function AddMemberResultTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Add Member Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/10 text-gray-500 dark:text-white">
                Student ID or Email
              </TableHead>
              <TableHead className="w-1/10 text-gray-500 dark:text-white">
                Role
              </TableHead>
              <TableHead className="w-min text-center text-gray-500 dark:text-white">
                Status
              </TableHead>
              <TableHead className=" text-gray-500 dark:text-white">
                Additional Information
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>aj47512.mg12@nycu.edu.tw</TableCell>
              <TableCell>Student</TableCell>
              <TableCell className="flex justify-center">
                <StatusIcon type="success" />
              </TableCell>
              <TableCell>This student has been 21.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>teacher@gmail.com</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell className="flex justify-center">
                <StatusIcon type="warning" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>111503010</TableCell>
              <TableCell>Student</TableCell>
              <TableCell className="flex justify-center">
                <StatusIcon type="error" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex justify-center gap-8 mt-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex gap-2">
            <StatusIcon type="success" />
            <span>Successfully added into the group</span>
          </div>
          <div className="flex gap-2">
            <StatusIcon type="warning" />
            <span>Waiting for user to register</span>
          </div>
          <div className="flex gap-2">
            <StatusIcon type="error" />
            <span>Fail to add member to the group</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
