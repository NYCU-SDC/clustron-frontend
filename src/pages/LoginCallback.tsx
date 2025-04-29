import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function LoginCallback() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["accessToken", "refreshToken"]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      setCookie("accessToken", accessToken, { path: "/" });
      setCookie("refreshToken", refreshToken, { path: "/" });
      navigate("/dashboard");
    } else {
      alert("login failed");
      navigate("/login");
    }
  }, [search, navigate, setCookie]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>process login...</p>
    </div>
  );
}
