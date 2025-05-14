import { useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { authContext } from "@/lib/auth/authContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function GuestRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isLoggedIn()) {
      navigate("/");
      toast(t("guestRoute.alreadyLoggedInToast"));
    }
  }, [location, mounted]);

  if (isLoggedIn()) return null;

  return children;
}
