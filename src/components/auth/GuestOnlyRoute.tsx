import { useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { authContext } from "@/lib/auth/authContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useContext(authContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
      toast.warning(t("guestRoute.alreadyLoggedInToast"));
    }
  }, [isLoggedIn, navigate, t]);

  if (isLoggedIn()) return null;

  return children;
}
