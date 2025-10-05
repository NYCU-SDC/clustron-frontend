import { Outlet } from "react-router-dom";
// import JobSidebar from "@/components/jobs/JobSidebar";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/sidebar";

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
        <SideBar
          title={t("jobsSideBar.title")}
          navItems={jobNavItems}
          className="min-w-36"
        />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
