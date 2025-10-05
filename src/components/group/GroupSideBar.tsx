import { useParams } from "react-router-dom";
import SideBar, { NavItem } from "@/components/sidebar";
import { useTranslation } from "react-i18next";

export default function GroupSideBarContainer({ title }: { title: string }) {
  const { id } = useParams();
  const { t } = useTranslation();

  const groupNavItems: NavItem[] = [
    {
      to: `/groups/${id}`,
      label: t("groupComponents.groupSideBar.overview"),
    },
    {
      to: `/groups/${id}/settings`,
      label: t("groupComponents.groupSideBar.groupSettings"),
    },
  ];

  return (
    <SideBar title={title} navItems={groupNavItems} className="min-w-36" />
  );
}
