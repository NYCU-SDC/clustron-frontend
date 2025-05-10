import {
  Outlet,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useEffect } from "react";
import GroupSideBarTEMP from "@/components/group/GroupSideBar";
import { useGroupContext } from "@/context/GroupContext";
import { useUserContext } from "@/context/UserContext";
import type { Group } from "@/lib/mockGroups";

export default function GroupPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { groups } = useGroupContext();
  const { user } = useUserContext();
  const isAdmin = user?.accessLevel === "admin";
  const group: Group | undefined = groups.find((g) => g.id === id);
  const isMember = group?.members.some((m) => m.studentId === user?.studentId);
  const isPreview = searchParams.get("preview") === "true";

  useEffect(() => {
    if (!group || !user || (!isMember && !isPreview && !isAdmin)) {
      navigate("/");
    }
  }, [group, user]);

  if (!group || !user || (!isMember && !isPreview && !isAdmin)) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GroupSideBarTEMP title={group.title} />
      <main className="flex-1 p-6 space-y-6">
        <Outlet context={{ group, groupId: id, isPreview }} />
      </main>
    </div>
  );
}
