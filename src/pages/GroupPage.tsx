import { Outlet, useParams } from "react-router-dom";
import GroupSideBar from "@/components/group/GroupSideBar";
import GroupDescription from "@/components/group/GroupDes";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { AccessLevelUser } from "@/types/group";
import { Loader2 } from "lucide-react";
import { useGroupPermissions } from "@/hooks/useGroupPermissions";
import type { GlobalRole } from "@/lib/permission";

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const payload = useJwtPayload();
  const { data: group, isLoading } = useGetGroupById(id!);

  const accessLevel = group?.me?.role.accessLevel;
  const globalRole = payload?.Role as GlobalRole;

  const { isReadonly } = useGroupPermissions(accessLevel, globalRole);

  if (isLoading || !group) return <div className="p-6">載入中...</div>;

  return (
    <div className="flex w-full max-h-screen">
      {isReadonly ? (
        <div className="flex-1 w-full  items-center justify-center">
          <main className=" max-w-2xl items-center justify-center p-6 space-y-6">
            <GroupDescription title={group.title} desc={group.description} />
          </main>
        </div>
      ) : (
        <>
          <GroupSideBar title={group.title} />
          <main className="flex-1 w-full p-6 space-y-6">
            <Outlet context={{ group, groupId: id }} />
          </main>
        </>
      )}
    </div>
  );
}
