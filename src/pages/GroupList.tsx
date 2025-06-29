import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import GroupDescription from "@/components/group/GroupDes";
import { useGetGroups } from "@/hooks/useGetGroups";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";
import { AccessLevelAdmin, AccessLevelOwner } from "@/types/group";

export default function GroupListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetGroups();
  const { canCreateGroup } = useGlobalPermissions();
  const payload = useJwtPayload();
  const { isLoggedIn } = useContext(authContext);
  console.log(payload);
  if (!isLoggedIn()) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-10 space-y-4 w-1/2 mx-auto">
      <div className="flex justify-between mb-6">
        {canCreateGroup && (
          <Button
            onClick={() => navigate("/groups/new")}
            className="bg-gray-900 text-white"
          >
            {t("groupPages.groupList.newCourse")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-500">{t("groupPages.groupList.loading")}</p>
      ) : isError ? (
        <p className="text-red-500">
          {t("groupPages.groupList.loadingFailed")}
        </p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">{t("groupPages.groupList.noCourses")}</p>
      ) : (
        <div className="space-y-4">
          {data.items.map((group) => {
            const accessLevel = AccessLevelOwner; // TODO: wait API for providing real accessLevel
            const isManager =
              accessLevel === AccessLevelOwner ||
              accessLevel === AccessLevelAdmin;
            const path = `/groups/${group.id}/${isManager ? "" : "info"}`;

            return (
              <div
                key={group.id}
                onClick={() => navigate(path)}
                className="cursor-pointer rounded-lg border hover:bg-gray-50 transition"
              >
                <GroupDescription
                  title={group.title}
                  desc={group.description}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
