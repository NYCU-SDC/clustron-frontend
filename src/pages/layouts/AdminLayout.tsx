import { Outlet } from "react-router";
import AdminSideBar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="min-w-xs border-r">
        <AdminSideBar />
      </div>
      <main className="flex-1 flex justify-center mt-20 px-6">
        <Outlet />
      </main>
    </div>
  );
}
