import { NavLink } from "react-router";

export default function SettingSideBar() {
  return (
    <aside className="mx-15 my-8">
      <div className="text-3xl font-semibold mb-8">Settings</div>
      <ul className="space-y-4">
        <li>
          <NavLink
            to={`/Settings/General`}
            className={({ isActive }) =>
              [
                "pl-1 py-2 rounded-lg text-sm",
                isActive ? "text-gray-500" : "text-black",
              ].join(" ")
            }
          >
            General
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/Settings/SSH`}
            className={({ isActive }) =>
              [
                "pl-1 py-2 rounded-lg text-sm",
                isActive ? "text-gray-500" : "text-black",
              ].join(" ")
            }
          >
            SSH
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
