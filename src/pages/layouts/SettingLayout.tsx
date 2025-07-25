import { Outlet } from "react-router";
import SettingSidebar from "@/components/setting/SettingSidebar";

export default function SettingLayout() {
  return (
    <>
      <SettingSidebar />
      <main className="flex-1 flex justify-center ">
        <Outlet />
      </main>
    </>
  );
}
