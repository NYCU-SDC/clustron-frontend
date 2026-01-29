import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function JobLayout() {
  const { t } = useTranslation();

  const jobNavItems: NavItem[] = [
    {
      to: `/jobs`,
      label: t("jobsSideBar.ListNavLink"),
    },
    {
      to: `/jobs/submit`,
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
        </ErrorBoundary>
      </div>
      <main className="flex-1 flex justify-center">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
