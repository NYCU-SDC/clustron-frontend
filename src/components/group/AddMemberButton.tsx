import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddMemberButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/AddMemberPage")}
      className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
    >
      <Plus className="w-4 h-4" />
      New Members
    </button>
  );
}
