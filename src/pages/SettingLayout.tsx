import { Outlet } from "react-router";
import SettingSidebar from "@/components/SettingSidebar";
import Navbar from "@/components/Navbar";

export default function SettingLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex">
        <SettingSidebar />
        <main className="flex-1 flex items-center justify-center pt-20 pr-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
