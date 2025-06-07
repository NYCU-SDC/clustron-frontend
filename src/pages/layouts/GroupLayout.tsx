import { Outlet } from "react-router-dom";

export default function GroupLayout() {
  return (
    <>
      <main className=" flex w-full justify-center mt-20">
        <Outlet />
      </main>
    </>
  );
}
