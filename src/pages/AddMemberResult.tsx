import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import CreateGroupResultTable from "@/components/group/CreateGroupResultTable";
import type { CreateGroupResultData } from "@/types/group";

export default function AddMemberResult() {
  const location = useLocation();
  const navigate = useNavigate();
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
    <div className="flex w-2/3 justify-center">
      <main className="w-full max-w-5xl min-w-5xl p-6">
        <CreateGroupResultTable
          result={result as CreateGroupResultData}
          members={members as { member: string; roleName: string }[]}
        />
      </main>
    </div>
  );
}
