import { Outlet, useParams } from "react-router-dom";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import SideBar, { NavItem } from "@/components/Sidebar";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/components/ErrorBoundary";

const Bomb = () => {
  throw new Error("💥 測試：只有這個小零件壞掉，Navbar 應該要活著！");
};

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
        <ErrorBoundary>
          <SideBar
            title={group.title}
            navItems={groupNavItems}
            className="min-w-36"
          />
          <Bomb />
        </ErrorBoundary>
      </div>
      <main className="flex-1 flex justify-center">
        <ErrorBoundary>
          <Outlet context={{ group, groupId: id }} />
          <Bomb />
        </ErrorBoundary>
      </main>
    </div>
  );
}
