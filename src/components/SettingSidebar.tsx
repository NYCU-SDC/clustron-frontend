import { NavLink } from "react-router";

export default function SettingSideBar() {
  return (
    <aside className="mx-15 my-8">
      <div className="text-4xl font-semibold mb-8">Settings</div>
      <ul className="space-y-4">
        <li>
          <NavLink
            to={`/Setting/general`}
            className={({ isActive }) =>
              [
                "text-base",
                "pl-1 py-2 rounded-lg",
                !isActive && "text-gray-500 dark:text-gray-400",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            General
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/Setting/ssh`}
            className={({ isActive }) =>
              [
                "text-base",
                "pl-1 py-2 rounded-lg",
                !isActive && "text-gray-500 dark:text-gray-400",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            SSH
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
