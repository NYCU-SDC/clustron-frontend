import { Outlet, useParams } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDes";
import GroupMemberTable from "@/components/group/GroupMemberTable";
import GroupSideBarTEMP from "@/components/group/GroupSideBarTEMP";
import { getCourseById } from "@/lib/courseMock";

export default function GroupPage() {
  const { id } = useParams();
  const course = getCourseById(id || "");

  if (!course) return <div className="p-6">Course not found.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBarTEMP title={course.title} />
      <main className="flex-1 p-6 space-y-6">
        <GroupDescription title={course.title} desc={course.desc} />
        <GroupMemberTable />
      </main>
    </div>
  );
}
