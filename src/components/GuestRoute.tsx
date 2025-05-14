import { useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { authContext } from "@/lib/auth/authContext";
import { toast } from "sonner";

export default function GuestRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isLoggedIn()) {
      navigate("/");
      toast("You are already logged in.");
    }
  }, [location, mounted]);

  if (isLoggedIn()) return null;

  return children;
}
