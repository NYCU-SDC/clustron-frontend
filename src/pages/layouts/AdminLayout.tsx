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
    if (!accessToken) {
      navigate("/", { replace: true });
      return;
    }
    const decodedRole = jwtDecode<AccessToken>(accessToken).Role;
    setRole(decodedRole);
    if (decodedRole !== "admin") {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  if (role != "admin") return null;

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r">
        <AdminSideBar />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
