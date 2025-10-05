import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/sidebar.tsx";

export default function SettingLayout() {
  const { t } = useTranslation();

  const settingNavItems: NavItem[] = [
    {
      to: "/setting/general",
      label: "settingSideBar.GeneralNavLink",
    },
    {
      to: "/setting/ssh",
      label: "settingSideBar.SSHNavLink",
    },
  ];

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r px-4">
        <SideBar
          title={t("settingSideBar.title")}
          navItems={settingNavItems}
          className="min-w-36"
        />
        ;
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
