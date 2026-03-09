import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/Sidebar";
import NavTabs from "@/components/NavTabs";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function SettingLayout() {
  const { t } = useTranslation();

  const settingNavItems: NavItem[] = [
    {
      to: "/setting/general",
      label: "settingSideBar.GeneralNavLink",
      end: true,
    },
    {
      to: "/setting/ssh",
      label: "settingSideBar.SSHNavLink",
      end: false,
    },
  ];

  return (
    <div className="flex w-full">
      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:block min-w-xs border-r px-4">
        <SideBar
          title={t("settingSideBar.title")}
          navItems={settingNavItems}
          className="min-w-36"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile title + tabs (hidden on md+) */}
        <NavTabs
          className="md:hidden px-4 pt-6 pb-0"
          title={t("settingSideBar.title")}
          navItems={settingNavItems}
        />

        {/* Content */}
        <main className="flex-1 flex md:justify-center">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
