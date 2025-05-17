import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GroupSideBar from "@/components/group/GroupSideBar";
import { useUserContext } from "@/context/UserContext";
import { useGetGroupById } from "@/hooks/useGetGroupById";

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useUserContext();

  const { data: group, isLoading } = useGetGroupById(id);
  const accessLevel = group?.me.role.accessLevel;
  const isAdmin = user?.accessLevel === "admin";

  const canView =
    (group || isLoading) && user && (accessLevel !== "user" || isAdmin);

  useEffect(() => {
    if (!canView) navigate("/groups");
  });

  if (isLoading || !canView) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBar title={group.title} />
      <main className="flex-1 p-6 space-y-6">
        <Outlet context={{ group, groupId: id }} />
      </main>
    </div>
  );
}
//帶改
