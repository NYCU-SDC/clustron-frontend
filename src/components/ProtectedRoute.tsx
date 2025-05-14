import { useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { authContext } from "@/lib/auth/authContext";
import { toast } from "sonner";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoggedIn()) {
      navigate("/login");
      toast("Please log in first.");
    }
  }, [mounted]);

  if (!isLoggedIn()) return null;

  return children;
}
