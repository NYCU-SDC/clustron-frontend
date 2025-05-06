import { Outlet, useParams } from "react-router-dom";
import GroupSideBarTEMP from "@/components/group/GroupSideBar";
import { getGroupById } from "@/lib/courseMock";

export default function GroupPage() {
  const { id } = useParams();
  const group = getGroupById(id || "");
  if (!group) return <div>Not found</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBarTEMP title={group.title} />
      <main className="flex-1 p-6 space-y-6">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </div>
  );
}
