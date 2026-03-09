import { NavLink, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

function mobileTabClass(isActive: boolean) {
  return [
    "text-sm px-3 py-2 rounded-lg whitespace-nowrap",
    isActive
      ? "font-semibold text-gray-900 dark:text-white bg-gray-200/50 dark:bg-gray-700"
      : "font-normal text-gray-500 dark:text-gray-400",
  ].join(" ");
}

export default function SettingLayout() {
  const { t } = useTranslation();

  const settingNavItems: NavItem[] = [
    {
      to: "/setting/general",
      label: "settingSideBar.GeneralNavLink",
      end: true,
    },
    {
      to: "/setting/ssh",
      label: "settingSideBar.SSHNavLink",
      end: false,
    },
  ];

  return (
    <div className="flex w-full">
      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:block min-w-xs border-r px-4">
        <SideBar
          title={t("settingSideBar.title")}
          navItems={settingNavItems}
          className="min-w-36"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile title + tabs (hidden on md+) */}
        <div className="md:hidden px-4 pt-6 pb-0">
          <h2 className="text-2xl font-semibold mb-4">
            {t("settingSideBar.title")}
          </h2>
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
            {settingNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end ?? true}
                className={({ isActive }) => mobileTabClass(isActive)}
              >
                {t(item.label)}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 flex md:justify-center">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
