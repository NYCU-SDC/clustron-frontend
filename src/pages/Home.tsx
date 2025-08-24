import { useNavigate } from "react-router-dom";
import { authContext } from "@/lib/auth/authContext";
import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();
  const { handleLogout } = useContext(authContext);

  useEffect(() => {
    navigate("/groups");
  }, [navigate]);
  return (
    <div className="p-6 space-x-4">
      <Button
        onClick={() => navigate("/onboarding")}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        前往填寫 Form
      </Button>
      <Button
        onClick={() => navigate("/login")}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        Login
      </Button>
      <Button
        onClick={handleLogout}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        Logout
      </Button>
      <Button
        onClick={() => navigate("/groups")}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        Go to group setting
      </Button>
      <Button
        onClick={() => navigate("/setting")}
        className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        Settings
      </Button>
    </div>
  );
}
