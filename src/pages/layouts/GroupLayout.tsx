import { Outlet } from "react-router-dom";
import GroupSideBar from "@/components/group/GroupSideBar";

export default function GroupLayout() {
  return (
    <div className="flex w-full h-full">
      <aside className="sticky top-23 border-r basis-1/6 shrink-0 self-start">
        <GroupSideBar title="Group" />
      </aside>

      <main className=" flex w-full justify-center">
        <Outlet />
      </main>
    </div>
  );
}
