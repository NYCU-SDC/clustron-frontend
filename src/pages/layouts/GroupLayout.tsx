import { Outlet, useParams } from "react-router-dom";
import GroupSideBar from "@/components/group/GroupSideBar";
import { useGetGroupById } from "@/hooks/useGetGroupById.ts";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading } = useGetGroupById(id!);

  if (isLoading || !group) return <div>loading...</div>;

  return (
    <>
      <GroupSideBar title={group.title} />
      <main className=" flex-1 flex justify-center mt-20">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </>
  );
}
