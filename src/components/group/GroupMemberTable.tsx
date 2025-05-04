import { useState } from "react";
import GroupMemberRow from "@/components/group/GroupMemberRow";
import AddMemberButton from "@/components/group/AddMemberButton";
import { Card, CardContent } from "@/components/ui/card";

export default function GroupMemberTable() {
  const [members, setMembers] = useState([
    {
      name: "王小明",
      id: "113999321",
      email: "liam@gmail.com",
      dept: "CS",
      role: "Student",
    },
    {
      name: "WANG",
      id: "1139991",
      email: "liam@gmail.com",
      dept: "EECS",
      role: "Student",
    },
  ]);

  const handleRemove = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Members</h2>
          <AddMemberButton />
        </div>
        <table className="w-full text-left text-sm border-t border-gray-200">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2">Name</th>
              <th className="py-2">Student ID or Email</th>
              <th className="py-2">Department</th>
              <th className="py-2">Role</th>
              <th className="py-2 text-right">Server Access</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <GroupMemberRow key={i} {...m} onDelete={() => handleRemove(i)} />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
