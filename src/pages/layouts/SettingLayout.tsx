import { Outlet } from "react-router";
import SettingSidebar from "@/components/setting/SettingSidebar";

export default function SettingLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="border-r">
        <SettingSidebar />
      </div>
      <main className="flex-1 flex w-full justify-center mt-20 px-6">
        <Outlet />
      </main>
    </div>
  );
}
