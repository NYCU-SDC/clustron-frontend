import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import CreateGroupResultTable from "@/components/group/CreateGroupResultTable";
import type { CreateGroupResultData } from "@/types/group";

export default function AddMemberResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();
  const { result, members } = location.state || {};

  useEffect(() => {
    if (!result || !members) {
      navigate(`/groups`);
    }
  }, [result, members, navigate]);

  if (!result || !members) {
    return null;
  }

  return (
    <div className="mx-auto">
      <main className="min-w-4xl p-6">
        <CreateGroupResultTable
          result={result as CreateGroupResultData}
          members={members as { member: string; roleName: string }[]}
          groupId={groupId}
        />
      </main>
    </div>
  );
}
