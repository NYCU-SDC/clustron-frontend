import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import GroupSideBarTEMP from "@/components/group/GroupSideBarTEMP";

export default function GroupPage() {
  return (
    <GroupSideBarTEMP>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-6 space-y-6">
          <GroupDescription />
          <GroupMemberTable />
        </main>
      </div>
    </GroupSideBarTEMP>
  );
}
