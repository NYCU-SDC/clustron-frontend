import { Outlet, useParams } from "react-router-dom";
import GroupSideBarTEMP from "@/components/group/GroupSideBar";
import { useGroupContext } from "@/context/GroupContext";
import type { Group } from "@/lib/mockGroups";

export default function GroupPage() {
  const { id } = useParams();
  const { groups } = useGroupContext();

  const group: Group | undefined = groups.find((g) => g.id === id);
  if (!group) return <div className="p-6">Group not found.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBarTEMP title={group.title} />
      <main className="flex-1 p-6 space-y-6">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </div>
  );
}
