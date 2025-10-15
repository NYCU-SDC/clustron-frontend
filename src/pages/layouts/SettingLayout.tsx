import { Outlet } from "react-router";
import SettingSidebar from "@/components/setting/SettingSidebar";

export default function SettingLayout() {
  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r">
        <SettingSidebar />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
