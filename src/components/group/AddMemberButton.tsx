import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  groupId: string;
  isArchived?: boolean;
};

export default function AddMemberButton({ groupId, isArchived }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isArchived) return; // 不做任何事
    navigate(`/groups/${groupId}/add-member`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isArchived}
      className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
    >
      <Plus className="w-4 h-4" />
      New Members
    </button>
  );
}
