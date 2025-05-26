import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex">
        <Outlet />
      </main>
    </div>
  );
}
