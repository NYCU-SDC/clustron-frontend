import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      <main className="flex-1 flex">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
