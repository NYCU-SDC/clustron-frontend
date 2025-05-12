import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { AccessTokenType } from "@/types/type";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Callback() {
  const [, setCookie] = useCookies([
    "accessToken",
    "refreshTokenExpirationTime",
    "refreshToken",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      const timer = setTimeout(() => {
        navigate("/login");
        toast("Login Failed");
      }, 0);
      return () => clearTimeout(timer);
    }

    setCookie("accessToken", accessToken, { path: "/" });
    setCookie("refreshToken", refreshToken, { path: "/" });
    setCookie(
      "refreshTokenExpirationTime",
      Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60,
      { path: "/" },
    );

    let redirectTo;
    if (jwtDecode<AccessTokenType>(accessToken).Role === "ROLE_NOT_SETUP") {
      redirectTo = "/onboading";
    } else {
      redirectTo = "/";
    }

    const timer = setTimeout(() => {
      navigate(redirectTo);
      toast("Login Successfully");
    }, 0);

    return () => clearTimeout(timer);
  }, [navigate, setCookie]);

  return <p>Loading...</p>;
}
