import SideBar, { NavItem } from "@/components/sidebar";
import { useTranslation } from "react-i18next";

export default function GroupSideBarContainer({ title }: { title: string }) {
  const { t } = useTranslation();
  const jobNavItems: NavItem[] = [
    {
      to: `/joblist`,
      label: t("jobsSideBar.ListNavLink"),
    },
    {
      to: `/jobform`,
      label: t("jobsSideBar.SubmitNavLink"),
    },
  ];
  console.log("傳遞給 SideBar 的 navItems:", jobNavItems);
  return <SideBar title={title} navItems={jobNavItems} className="min-w-36" />;
}
