import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

interface SettingSideBarContainerProps {
  title: string;
}

export function SettingSideBarContainer({
  title,
}: SettingSideBarContainerProps) {
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
    <SideBar title={title} navItems={settingNavItems} className="min-w-36" />
  );
}
