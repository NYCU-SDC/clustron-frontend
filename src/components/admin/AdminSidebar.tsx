import { useTranslation } from "react-i18next";
import SideBar, { NavItem } from "@/components/ui/sidebar.tsx"; // Adjust path

export function AdminSideBarContainer() {
  const { t } = useTranslation();

  // Prepare the data
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
