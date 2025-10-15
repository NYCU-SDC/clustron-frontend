import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/lib/token";
import { useState, useEffect } from "react";
import { AccessToken } from "@/types/settings";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/Sidebar";

export default function AdminLayout() {
  const accessToken = getAccessToken();
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const adminNavItems: NavItem[] = [
    {
      to: "/admin/role-access",
      label: t("adminSidebar.roleAccessConfigLink"),
    },
  ];

  if (role !== "admin") return null;

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r px-4">
        <SideBar
          title={t("adminSidebar.title")}
          navItems={adminNavItems}
          className="min-w-36"
        />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
