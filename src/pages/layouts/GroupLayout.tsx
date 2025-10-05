import { Outlet, useParams } from "react-router-dom";
// import GroupSideBar from "@/components/group/GroupSideBar";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import SideBar, { NavItem } from "@/components/sidebar";
import { useTranslation } from "react-i18next";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading } = useGetGroupById(id!);
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

  if (isLoading || !group) return <div>loading...</div>;

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r">
        <SideBar
          title={t("group.title")}
          navItems={groupNavItems}
          className="min-w-36"
        />
        ;
      </div>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>

    // <GroupSideBar title={group.title} />
    // <main className=" flex-1 flex justify-center ">
    //   <Outlet context={{ group, groupId: id }} />
    // </main>
  );
}
