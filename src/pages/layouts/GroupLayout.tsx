import { Outlet, useParams, Navigate } from "react-router";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import SideBar, { NavItem } from "@/components/Sidebar";
import GroupMobileHeader from "@/components/group/GroupMobileHeader";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GlobalRole } from "@/lib/permission";
import { getGroupPermissions } from "@/lib/groupPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";

export default function GroupLayout() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGetGroupById(id!);
  const payload = useJwtPayload();
  const accessLevel = group?.me.role.accessLevel;
  const globalRole = payload?.Role as GlobalRole;
  const isReadonly = getGroupPermissions(accessLevel, globalRole).isReadonly;
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

  const readonlyNavItems: NavItem[] = [
    {
      to: `/groups/${id}/`,
      label: t("groupComponents.groupSideBar.overview"),
    },
  ];

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (isError || !group) {
    return <Navigate to="/groups" replace />;
  }

  return (
    <div className="flex w-full flex-col md:flex-row">
      <GroupMobileHeader
        title={group.title}
        ldapGroupName={group.ldapGroupName}
        navItems={isReadonly ? readonlyNavItems : groupNavItems}
      />
      <div className="hidden w-xs border-r px-4 md:block">
        <SideBar
          title={group.title}
          navItems={isReadonly ? readonlyNavItems : groupNavItems}
          className="min-w-36"
        />
      </div>
      <main className="flex flex-1 justify-center">
        <ErrorBoundary>
          <Outlet context={{ group, groupId: id }} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
