import { Outlet } from "react-router";
import AdminSideBar from "@/components/admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/lib/token";
import { useState, useEffect } from "react";
import { AccessToken } from "@/types/type";
import { useNavigate } from "react-router";

export default function AdminLayout() {
  const accessToken = getAccessToken();
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      setRole(jwtDecode<AccessToken>(accessToken).Role);
    }

    if (role != "admin") {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate, role]);

  if (role != "admin") return null;

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
