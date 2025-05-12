import {
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useEffect } from "react";
import GroupSideBarTEMP from "@/components/group/GroupSideBar";
import { useUserContext } from "@/context/UserContext";
import { useGetGroupById } from "@/api/queries/useGetGroupById";

export default function GroupPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useUserContext();
  const isPreview = searchParams.get("preview") === "true";

  const { data: group, isLoading } = useGetGroupById(id);
  console.log("[GroupPage] group:", group);
  const accessLevel = group?.me.role.accessLevel;
  const isAdmin = user?.accessLevel === "admin";

  const canView =
    group && user && (accessLevel !== "user" || isPreview || isAdmin);

  useEffect(() => {
    if (!canView) navigate("/groups");
  }, [group, user]);

  if (isLoading || !canView) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBarTEMP title={group.title} />
      <main className="flex-1 p-6 space-y-6">
        <Outlet context={{ group, groupId: id, isPreview }} />
      </main>
    </div>
  );
}
