// import { useTranslation } from "react-i18next";
import GroupDescription from "@/components/group/GroupDes";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import { useOutletContext } from "react-router-dom";
import type { GroupDetail } from "@/types/group";
import type { GlobalRole } from "@/lib/permission";
import { Outlet } from "react-router";

type GroupContext = {
  group: GroupDetail;
  groupId: string;
};

export default function GroupPage() {
  // const { t } = useTranslation();
  const { group, groupId } = useOutletContext<GroupContext>();
  const payload = useJwtPayload();

  const accessLevel = group.me.role.accessLevel;
  const globalRole = payload?.Role as GlobalRole;

  const { isReadonly } = useGroupPermissions(accessLevel, globalRole);

  return (
    <div className="flex w-full">
      {isReadonly ? (
        <div className="flex-1 w-full items-center justify-center">
          <main className="max-w-2xl items-center justify-center p-6">
            <GroupDescription title={group.title} desc={group.description} />
          </main>
        </div>
      ) : (
        <main className="flex-1 w-full p-6 space-y-6">
          <Outlet context={{ group, groupId }} />
        </main>
      )}
    </div>
  );
}
