import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      {/* <div>Hello world</div> */}
      <button
        onClick={() => navigate("/Onboarding")}
        className="px-4 py-2 bg-blue-600 text-white rounded 
                hover:shadow-lg hover:ring-2 hover:ring-blue-300 
                active:bg-blue-700 transition duration-150"
      >
        前往填寫 Form
      </button>
    </div>
  );
}
