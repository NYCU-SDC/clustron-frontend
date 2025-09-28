import { Outlet } from "react-router-dom";
import JobSidebar from "@/components/jobs/JobSidebar";
import { useTranslation } from "react-i18next";

export default function JobLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r">
        <JobSidebar title={t("settingSideBar.title")} />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
