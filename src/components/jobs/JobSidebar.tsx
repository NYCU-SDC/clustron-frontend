import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

function navLinkClass(isActive: boolean) {
  return [
    "text-base",
    "pl-1 py-2 rounded-lg",
    !isActive && "text-gray-500 dark:text-gray-400",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function JobSidebar() {
  const { t } = useTranslation();
  return (
    <aside className="sticky top-[7rem] self-start min-w-48 ml-15 my-8">
      <div className="text-4xl font-semibold mb-8">
        {t("jobsSideBar.title")}
      </div>
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/joblist"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            {t("jobsSideBar.ListNavLink")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/jobform"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            {t("jobsSideBar.SubmitNavLink")}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
