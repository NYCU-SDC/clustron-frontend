import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GroupSideBar from "@/components/group/GroupSideBar";
import { useGetGroupById } from "@/hooks/useGetGroupById";
import { useJwtPayload } from "@/hooks/useJwtPayload"; // ✅ 新的 JWT 來源

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const payload = useJwtPayload();
  const { data: group, isLoading } = useGetGroupById(id!); // id 保證存在

  const accessLevel = group?.me?.role.accessLevel;
  const isGlobalAdmin =
    payload?.role === "admin" || payload?.role === "organizer";

  const canView =
    isLoading || (payload && (accessLevel !== "USER" || isGlobalAdmin));

  // ✅ 沒權限自動導回 group list
  useEffect(() => {
    if (!canView) navigate("/groups");
  }, [canView, navigate]);

  if (isLoading || !canView) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBar title={group!.title} />
      <main className="flex-1 p-6 space-y-6">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </div>
  );
}
