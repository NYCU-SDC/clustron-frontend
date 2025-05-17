import { useContext, useEffect, useRef, ReactNode } from "react";
import { useNavigate } from "react-router";
import { authContext } from "@/lib/auth/authContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    if (isLoggedIn()) {
      navigate("/");
      toast.warning(t("guestRoute.alreadyLoggedInToast"));
    }
  }, [isLoggedIn, navigate, t]);

  if (isLoggedIn()) return null;

  return children;
}
