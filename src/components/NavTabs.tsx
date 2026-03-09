import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./ErrorBoundary";
import { NavItem } from "./Sidebar";

function tabLinkClass(isActive: boolean): string {
  return [
    "text-sm px-3 py-2 rounded-lg whitespace-nowrap",
    isActive
      ? "font-semibold text-gray-900 dark:text-white bg-gray-200/50 dark:bg-gray-700"
      : "font-normal text-gray-500 dark:text-gray-400",
  ].join(" ");
}

interface NavTabsProps {
  title: string;
  navItems: NavItem[];
  className?: string;
}

export default function NavTabs({ title, navItems, className }: NavTabsProps) {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <div className={className}>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end ?? true}
              className={({ isActive }) => tabLinkClass(isActive)}
            >
              {t(item.label)}
            </NavLink>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
