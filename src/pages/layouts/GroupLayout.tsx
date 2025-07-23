import { Outlet } from "react-router-dom";
import GroupSideBar from "@/components/group/GroupSideBar";

export default function GroupLayout() {
  return (
    <div className="flex w-full min-h-screen">
      <aside className="sticky top-6  border-r z-10">
        <GroupSideBar title="Group" />
      </aside>

      <main className=" flex w-full justify-center mt-20">

        <Outlet />
      </main>
    </div>
  );
}
