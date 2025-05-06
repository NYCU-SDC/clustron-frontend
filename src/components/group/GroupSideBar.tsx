import { NavLink, useParams } from "react-router-dom";

export default function GroupSideBar({ title }: { title: string }) {
  const { id } = useParams();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-2 py-1 rounded transition-colors ${
      isActive ? "text-black font-medium" : "text-gray-500"
    } hover:bg-gray-100`;

  return (
    <aside className="w-64 border-r p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        <li>
          <NavLink to={`/group/${id}`} end className={linkClass}>
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink to={`/group/${id}/settings`} className={linkClass}>
            Group Settings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
