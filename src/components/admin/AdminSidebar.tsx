import { NavLink } from "react-router";
// import { useTranslation } from "react-i18next";

function navLinkClass(isActive: boolean) {
  return [
    "text-base",
    "pl-1 py-2 rounded-lg",
    !isActive && "text-gray-500 dark:text-gray-400",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function AdminSideBar() {
  //   const { t } = useTranslation();
  return (
    <aside className="sticky top-[7rem] self-start min-w-36 ml-15 my-8">
      <div className="text-4xl font-semibold mb-8">Admin</div>
      <ul className="space-y-4">
        <li>
          <NavLink to="#" className={({ isActive }) => navLinkClass(isActive)}>
            Role Access Configuration
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
