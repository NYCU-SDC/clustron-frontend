import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

const Bomb = () => {
  throw new Error("💥 測試：只有這個小零件壞掉，Navbar 應該要活著！");
};

export default function SettingLayout() {
  const { t } = useTranslation();

  const settingNavItems: NavItem[] = [
    {
      to: "/setting/general",
      label: "settingSideBar.GeneralNavLink",
    },
    {
      to: "/setting/ssh",
      label: "settingSideBar.SSHNavLink",
    },
  ];

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r px-4">
        <ErrorBoundary>
          <SideBar
            title={t("settingSideBar.title")}
            navItems={settingNavItems}
            className="min-w-36"
          />
          <Bomb />
        </ErrorBoundary>
      </div>
      <main className="flex-1 flex justify-center">
        <ErrorBoundary>
          <Outlet />
          <Bomb />
        </ErrorBoundary>
      </main>
    </div>
  );
}
