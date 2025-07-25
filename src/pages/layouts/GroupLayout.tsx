import { Outlet, useParams } from "react-router-dom";
import GroupSideBar from "@/components/group/GroupSideBar";
import { useGetGroupById } from "@/hooks/useGetGroupById.ts";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading } = useGetGroupById(id!);

  if (isLoading || !group) return <div>loading...</div>;

  return (
    <div className="flex w-full min-h-screen">
      <aside className="sticky top-6  border-r z-10">
        <GroupSideBar title={group.title} />
      </aside>

      <main className=" flex w-full justify-center">
        <Outlet />
      </main>
    </div>
  );
}
