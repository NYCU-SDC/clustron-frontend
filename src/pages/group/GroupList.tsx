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
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-4 md:space-y-6">
      <div className="flex justify-between mb-6">
        {canCreateGroup && (
          <Button
            onClick={() => navigate("/groups/new")}
            className="w-full sm:w-auto"
          >
            {t("groupPages.groupList.newGroup")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{t("groupPages.groupList.loading")}</span>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-red-500">
          <Loader2 className="w-4 h-4" />
          <span>{t("groupPages.groupList.loadingFailed")}</span>
        </div>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">{t("groupPages.groupList.noCourses")}</p>
      ) : (
        <div className="space-y-4">
          {data.items.map((group) => (
            <div key={group.id}>
              <NavLink to={`/groups/${group.id}/`} className="block">
                <GroupDescription
                  title={group.title}
                  ldapGroupName={group.ldapGroupName}
                  desc={group.description}
                />
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
