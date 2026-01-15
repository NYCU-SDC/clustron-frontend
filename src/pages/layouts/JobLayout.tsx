import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

const Bomb = () => {
  throw new Error("💥 測試：只有這個小零件壞掉，Navbar 應該要活著！");
};

export default function JobLayout() {
  const { t } = useTranslation();

  const jobNavItems: NavItem[] = [
    {
      to: `/joblist`,
      label: t("jobsSideBar.ListNavLink"),
    },
    {
      to: `/jobform`,
      label: t("jobsSideBar.SubmitNavLink"),
    },
  ];

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r">
        <ErrorBoundary>
          <SideBar
            title={t("jobsSideBar.title")}
            navItems={jobNavItems}
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
