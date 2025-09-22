import { useParams } from "react-router-dom";
import SideBar, { NavItem } from "@/components/ui/sidebar.tsx";

export default function GroupSideBarContainer({ title }: { title: string }) {
  const { id } = useParams();

  const groupNavItems: NavItem[] = [
    {
      to: `/groups/${id}`,
      labelKey: "groupComponents.groupSideBar.overview",
    },
    {
      to: `/groups/${id}/settings`,
      labelKey: "groupComponents.groupSideBar.groupSettings",
    },
  ];

  return (
    <SideBar title={title} navItems={groupNavItems} className="min-w-36" />
  );
}
