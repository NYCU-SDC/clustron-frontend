import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

export function AdminSideBarContainer() {
  const { t } = useTranslation();

  const adminNavItems: NavItem[] = [
    {
      to: "#",
      labelKey: "adminSidebar.roleAccessConfigLink",
    },
  ];

  return (
    <SideBar
      title={t("adminSidebar.title")}
      navItems={adminNavItems}
      className="min-w-48"
    />
  );
}
