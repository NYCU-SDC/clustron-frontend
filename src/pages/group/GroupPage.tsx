import { Outlet, useOutletContext } from "react-router";
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
        <main className="w-full flex-1 space-y-6 p-4 sm:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <GroupDescription
              title={group.title}
              ldapGroupName={group.ldapGroupName}
              desc={group.description}
              links={group.links ?? []}
            />
          </div>
        </main>
      ) : (
        <main className="w-full flex-1 space-y-6 p-4 sm:p-6">
          <Outlet context={{ group, groupId }} />
        </main>
      )}
    </div>
  );
}
