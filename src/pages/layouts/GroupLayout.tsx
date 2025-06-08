import { Outlet } from "react-router-dom";

export default function GroupLayout() {
  return (
    <>
      <main className="flex-1 flex justify-center mt-20">
        <Outlet />
      </main>
    </>
  );
}
