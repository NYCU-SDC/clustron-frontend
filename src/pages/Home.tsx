import { useNavigate } from "react-router-dom";
import { authContext } from "@/lib/auth/authContext";
import { useContext } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useContext(authContext);

  return (
    <div className="p-6 space-x-4">
      <button
        onClick={() => navigate("/Onboarding")}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        前往填寫 Form
      </button>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        Login
      </button>
      <button
        onClick={() => logout()}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        logout
      </button>
    </div>
  );
}
