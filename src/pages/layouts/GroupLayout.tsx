import { Outlet, useParams, Navigate, useLocation } from "react-router";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import SideBar, { NavItem } from "@/components/Sidebar";
import NavTabs from "@/components/NavTabs";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GlobalRole } from "@/lib/permission";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: group, isLoading, isError } = useGetGroupById(id!);
  const payload = useJwtPayload();
  const accessLevel = group?.me.role.accessLevel;
  const globalRole = payload?.Role as GlobalRole;
  const isReadonly = getGroupPermissions(accessLevel, globalRole).isReadonly;
  const { t } = useTranslation();

  const groupNavItems: NavItem[] = [
    {
      to: `/groups/${id}/`,
      label: "groupComponents.groupSideBar.overview",
    },
    {
      to: `/groups/${id}/settings`,
      label: "groupComponents.groupSideBar.groupSettings",
    },
  ];

  const readonlyNavItems: NavItem[] = [
    {
      to: `/groups/${id}/`,
      label: "groupComponents.groupSideBar.overview",
    },
  ];

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (isError || !group) {
    return <Navigate to="/groups" replace />;
  }

  const overviewPath = `/groups/${id}`;
  const isOverviewRoute =
    location.pathname === overviewPath || location.pathname === `${overviewPath}/`;

  if (isReadonly && !isOverviewRoute) {
    return <Navigate to={overviewPath} replace />;
  }

  return (
    <div className="flex w-full">
      <div className="hidden w-xs border-r px-4 md:block">
        <SideBar
          title={group.title}
          navItems={isReadonly ? readonlyNavItems : groupNavItems}
          className="min-w-36"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <NavTabs
          className="px-4 pt-6 pb-0 md:hidden"
          title={group.title}
          navItems={isReadonly ? readonlyNavItems : groupNavItems}
        />

        <main className="flex flex-1 justify-center">
          <ErrorBoundary>
            <Outlet context={{ group, groupId: id }} />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
