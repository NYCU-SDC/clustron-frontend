import JobSidebar from "@/components/jobs/JobSidebar.jsx";
import JobSubmitForm from "@/components/jobs/JobSubmitForm.tsx";

export default function JobSubmitPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="min-w-xs border-r">
        <JobSidebar />
      </div>

      {/* Main */}
      <JobSubmitForm />
    </div>
  );
}
