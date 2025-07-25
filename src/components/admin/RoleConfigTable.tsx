import { useState } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
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
import { GlobalRole, GLOBAL_ROLES } from "@/types/group";

type RoleConfig = {
  id: string;
  roleName: string;
  accessLevel: GlobalRole;
};

export default function RoleConfigTable() {
  const [roleConfigs, setRoleConfigs] = useState<RoleConfig[]>([
    { id: "1", roleName: "Student", accessLevel: "user" },
    { id: "2", roleName: "TA", accessLevel: "organizer" },
    { id: "3", roleName: "Teacher", accessLevel: "admin" },
  ]);

  const [newRole, setNewRole] = useState<{
    roleName: string;
    accessLevel: GlobalRole;
  }>({
    roleName: "",
    accessLevel: "user",
  });
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  const handleAddRole = () => {
    if (newRole.roleName.trim()) {
      const newRoleConfig: RoleConfig = {
        id: Date.now().toString(),
        roleName: newRole.roleName.trim(),
        accessLevel: newRole.accessLevel,
      };
      setRoleConfigs([...roleConfigs, newRoleConfig]);
      setNewRole({ roleName: "", accessLevel: "user" });
    }
  };

  const handleRemoveRole = (id: string) => {
    setDeleteRoleId(id);
  };

  const confirmRemoveRole = () => {
    if (deleteRoleId) {
      setRoleConfigs(roleConfigs.filter((role) => role.id !== deleteRoleId));
      setDeleteRoleId(null);
    }
  };

  const formatGlobalRole = (role: GlobalRole): string => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl">Role Access Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  Role
                </TableHead>
                <TableHead className="w-1/5 py-4 px-4 text-gray-500 dark:text-white">
                  Access
                </TableHead>
                <TableHead className="py-4 px-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleConfigs.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted">
                  <TableCell className="py-4 px-4">{role.roleName}</TableCell>
                  <TableCell className="py-4 px-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm font-medium rounded-xl">
                      {formatGlobalRole(role.accessLevel)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRole(role.id)}
                      className="text-gray-600 hover:text-red-600 hover:cursor-pointer"
                    >
                      <CircleMinus size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell className="py-4 px-4">
                  <Input
                    value={newRole.roleName}
                    placeholder="Enter Role Name"
                    className="border-none shadow-none focus-visible:ring-0 p-0 dark:bg-transparent"
                    onChange={(e) =>
                      setNewRole({ ...newRole, roleName: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Select
                    value={newRole.accessLevel}
                    onValueChange={(value: GlobalRole) =>
                      setNewRole({ ...newRole, accessLevel: value })
                    }
                  >
                    <SelectTrigger className="px-2 py-1 text-sm font-medium rounded-xl border-none shadow-none hover:cursor-pointer dark:hover:bg-gray-600 focus:ring-0 w-fit">
                      <SelectValue placeholder="Select Access" />
                    </SelectTrigger>
                    <SelectContent>
                      {GLOBAL_ROLES.map((level) => (
                        <SelectItem key={level} value={level}>
                          {formatGlobalRole(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddRole}
                    className="text-gray-600 hover:text-green-600 hover:cursor-pointer"
                  >
                    <CirclePlus size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteRoleId}
        onOpenChange={() => setDeleteRoleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Remove Role Confirm
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure to remove this role?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteRoleId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveRole}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
