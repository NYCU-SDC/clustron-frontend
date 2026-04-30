import { useNavigate, NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import GroupDescription from "@/components/group/GroupDescription.tsx";
import { useGetGroups } from "@/hooks/useGetGroups";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

export default function GroupListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetGroups();
  const { canCreateGroup } = useGlobalPermissions();
  const { isLoggedIn } = useContext(authContext);

  if (!isLoggedIn()) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-10 space-y-4 w-1/2 mx-auto">
      <div className="flex justify-between mb-6">
        {canCreateGroup && (
          <Button onClick={() => navigate("/groups/new")}>
            {t("groupPages.groupList.newGroup")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-500">{t("groupPages.groupList.loading")}</p>
      ) : isError ? (
        <p className="text-red-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("groupPages.groupList.loadingFailed")}
        </p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">{t("groupPages.groupList.noCourses")}</p>
      ) : (
        <div className="space-y-4">
          {data.items.map((group) => {
            return (
              <div>
                <NavLink key={group.id} to={`/groups/${group.id}/`}>
                  <GroupDescription
                    title={group.title}
                    ldapGroupName={group.ldapGroupName}
                    desc={group.description}
                  />
                </NavLink>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
