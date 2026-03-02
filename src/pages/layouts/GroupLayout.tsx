import { Outlet, useParams, Navigate } from "react-router";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import SideBar, { NavItem } from "@/components/Sidebar";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGetGroupById(id!);
  const { t } = useTranslation();

  const groupNavItems: NavItem[] = [
    {
      to: `/groups/${id}/`,
      label: t("groupComponents.groupSideBar.overview"),
    },
    {
      to: `/groups/${id}/settings`,
      label: t("groupComponents.groupSideBar.groupSettings"),
    },
  ];

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (isError || !group) {
    return <Navigate to="/groups" replace />;
  }

  return (
    <div className="flex w-full">
      <div className="min-w-xs border-r px-4">
        <SideBar
          title={group.title}
          navItems={groupNavItems}
          className="min-w-36"
        />
      </div>
      <main className="flex-1 flex justify-center">
        <ErrorBoundary>
          <Outlet context={{ group, groupId: id }} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
