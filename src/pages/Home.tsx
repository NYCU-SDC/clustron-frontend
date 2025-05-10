import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-4">
        <button
          onClick={() => navigate("/Onboarding")}
          className="px-4 py-2 bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
        >
          前往填寫 Form
        </button>
      </div>
    </>
  );
}
