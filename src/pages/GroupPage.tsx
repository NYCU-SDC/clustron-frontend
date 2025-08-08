import { Outlet, useOutletContext } from "react-router-dom";
import GroupDescription from "@/components/group/GroupDescription.tsx";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { getGroupPermissions } from "@/lib/groupPermissions";
import type { GlobalRole } from "@/lib/permission";
import type { GroupDetail } from "@/types/group";

type GroupContext = {
  group: GroupDetail;
  groupId: string;
};

export default function GroupPage() {
  const { group, groupId } = useOutletContext<GroupContext>();
  const payload = useJwtPayload();

  const accessLevel = group.me.role.accessLevel;
  const globalRole = payload?.Role as GlobalRole;
  const { isReadonly } = getGroupPermissions(accessLevel, globalRole);

  return (
    <div className="flex w-full">
      {isReadonly ? (
        <div className="flex-1 w-full items-center justify-center">
          <main className="max-w-2xl items-center justify-center p-6">
            <GroupDescription
              title={group.title}
              desc={group.description}
              links={group.links ?? []}
              isArchived={group.isArchived}
            />
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
