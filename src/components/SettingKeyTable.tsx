import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

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

export default function SettingKeyTable() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="py-5 flex justify-between">
        <CardTitle className="text-2xl">SSH Keys</CardTitle>
        <Button onClick={() => navigate("/Setting/addNewKey")}>
          {" "}
          ＋ New SSH Keys
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 text-gray-500 dark:text-white">
                Title
              </TableHead>
              <TableHead className="w-1/2 text-gray-500 dark:text-white">
                Key
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>My Laptop</TableCell>
              <TableCell>AAA</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" className="cursor-pointer">
                  <Trash2 className="!w-5 !h-5" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
