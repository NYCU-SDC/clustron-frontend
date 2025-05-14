import { useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authContext } from "@/lib/auth/authContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoggedIn()) {
      navigate("/login");
      toast(t("protectedRoute.notLoggedInToast"));
    }
  }, [mounted]);

  if (!isLoggedIn()) return null;

  return children;
}
