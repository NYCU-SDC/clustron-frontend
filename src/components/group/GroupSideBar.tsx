import { NavLink, useParams } from "react-router-dom";
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

export default function GroupSideBar({ title }: { title: string }) {
  const { id } = useParams();
  const { t } = useTranslation();
  return (
    <aside className="sticky top-[7rem] self-start min-w-36 ml-15 my-8">
      <div className="text-4xl font-semibold mb-8">{title}</div>
      <ul className="space-y-4">
        <li>
          <NavLink
            to={`/groups/${id}`}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            {t("groupComponents.groupSideBar.overview")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/groups/${id}/settings`}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            {t("groupComponents.groupSideBar.groupSettings")}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
