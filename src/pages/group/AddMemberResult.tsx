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
    <div className="mx-auto w-full px-4 py-6 sm:px-6">
      <main className="mx-auto w-full max-w-5xl">
        <CreateGroupResultTable
          result={result as CreateGroupResultData}
          members={members as { member: string; roleName: string }[]}
          groupId={groupId}
        />
      </main>
    </div>
  );
}
