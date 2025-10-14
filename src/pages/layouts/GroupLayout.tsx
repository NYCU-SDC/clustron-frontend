import { Outlet, useParams } from "react-router";
import GroupSideBar from "@/components/group/GroupSideBar";
import { useGetGroupById } from "@/hooks/useGetGroupById";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading } = useGetGroupById(id!);

  if (isLoading || !group) return <div>loading...</div>;

  return (
    <>
      <GroupSideBar title={group.title} />
      <main className=" flex-1 flex justify-center ">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </>
  );
}
