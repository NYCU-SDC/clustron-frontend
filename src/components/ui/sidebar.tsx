import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function navLinkClass(isActive: boolean): string {
  return [
    "text-base",
    "w-full block",
    "pl-1 py-2 rounded-lg",
    !isActive && "text-gray-500 dark:text-gray-400 hover:bg-gray-200",
  ]
    .filter(Boolean)
    .join(" ");
}

export interface NavItem {
  to: string;
  labelKey: string;
}

interface SideBarProps {
  title: string;
  navItems: NavItem[];
  className?: string;
}

export default function SideBar({ title, navItems, className }: SideBarProps) {
  const { t } = useTranslation();

  return (
    <aside
      className={`sticky top-[7rem] self-start ml-15 my-8 ${className || ""}`}
    >
      <div className="text-4xl font-semibold mb-8">{title}</div>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {t(item.labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
