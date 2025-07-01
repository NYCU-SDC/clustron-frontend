import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GroupSideBar from "@/components/group/GroupSideBar";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useJwtPayload } from "@/hooks/useJwtPayload";
import { AccessLevelUser } from "@/types/group";
export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const payload = useJwtPayload();
  const { data: group, isLoading } = useGetGroupById(id!);

  const accessLevel = group?.me?.role.accessLevel;
  const isGlobalAdmin =
    payload?.Role === "admin" || payload?.Role === "organizer";

  const canView =
    isLoading ||
    (payload && (accessLevel !== AccessLevelUser || isGlobalAdmin));

  useEffect(() => {
    if (!canView) navigate("/groups");
  }, [canView, navigate]);

  if (isLoading || !canView) return null;

  return (
    <div className="flex w-full  ">
      <GroupSideBar title={group!.title} />
      <main className="flex-1 w-full p-6 ">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </div>
  );
}
