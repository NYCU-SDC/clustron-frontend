import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen">
      <Button
        variant="outline"
        className="w-50"
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    </div>
  );
}
