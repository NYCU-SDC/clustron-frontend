import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import AddMemberResultTable from "@/components/group/AddMemberResultTable";
import type { AddGroupMemberResponse } from "@/types/group";

export default function AddMemberResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: groupId } = useParams();
  const { result, members } = location.state || {};

  useEffect(() => {
    if (!result || !members) {
      navigate(`/groups/${groupId}/settings`);
    }
  }, [result, members, navigate, groupId]);

  if (!result || !members) {
    return null;
  }

  return (
    <div className="flex w-2/3 justify-center">
      <main className="w-full max-w-5xl min-w-5xl p-6">
        <AddMemberResultTable
          result={result as AddGroupMemberResponse}
          members={members as { member: string; roleName: string }[]}
        />
      </main>
    </div>
  );
}
