import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

export function SettingSideBarContainer() {
  const { t } = useTranslation();

  const settingNavItems: NavItem[] = [
    {
      to: "/setting/general",
      labelKey: "settingSideBar.GeneralNavLink",
    },
    {
      to: "/setting/ssh",
      labelKey: "settingSideBar.SSHNavLink",
    },
  ];

  return (
    <SideBar
      title={t("settingSideBar.title")}
      navItems={settingNavItems}
      className="min-w-48"
    />
  );
}
