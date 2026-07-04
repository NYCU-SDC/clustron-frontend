import { Outlet, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/lib/token";
import { useState, useEffect } from "react";
import type { AccessToken } from "@/types/settings";
import { useTranslation } from "react-i18next";
import SideBar, { type NavItem } from "@/components/Sidebar";
import NavTabs from "@/components/NavTabs";
import ErrorBoundary from "@/components/ErrorBoundary";

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
      to: "/admin/users",
      label: t("adminSidebar.userConfigLink"),
    },
    {
      to: "/admin/config",
      label: t("adminSidebar.roleAccessConfigLink"),
    },
  ];
  if (role !== "admin") return null;

  return (
    <div className="flex w-full">
      {/* Desktop sidebar */}
      <div className="hidden md:block min-w-xs border-r px-4">
        <SideBar
          title={t("adminSidebar.title")}
          navItems={adminNavItems}
          className="min-w-36"
        />
      </div>

      {/* Right content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile tabs */}
        <NavTabs
          className="px-4 pt-6 pb-0 md:hidden"
          title={t("adminSidebar.title")}
          navItems={adminNavItems}
        />

        <main className="flex min-w-0 flex-1 md:justify-center">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
