import { Outlet } from "react-router";
import AdminSideBar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <>
      <AdminSideBar />
      <main className="flex-1 flex justify-center mt-20">
        <Outlet />
      </main>
    </>
  );
}
