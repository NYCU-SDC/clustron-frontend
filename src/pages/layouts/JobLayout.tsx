import { Outlet } from "react-router-dom";
import JobSidebar from "@/components/jobs/JobSidebar";

export default function JobLayout() {
  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r">
        <JobSidebar />
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
