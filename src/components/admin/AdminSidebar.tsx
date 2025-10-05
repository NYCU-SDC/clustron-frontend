import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/sidebar";

export function AdminSideBarContainer() {
  const { t } = useTranslation();

  const adminNavItems: NavItem[] = [
    {
      to: "#",
      label: "adminSidebar.roleAccessConfigLink",
    },
  ];

  return (
    <SideBar
      title={t("adminSidebar.title")}
      navItems={adminNavItems}
      className="min-w-36"
    />
  );
}
