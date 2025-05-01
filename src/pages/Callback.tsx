import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Callback() {
  const [, setCookie] = useCookies(["accessToken", "refreshToken"]);
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const redirectTo = "/home";

    if (!accessToken || !refreshToken) {
      setStatus("error");
      return;
    }

    setCookie("accessToken", accessToken, { path: "/" });
    setCookie("refreshToken", refreshToken, { path: "/" });

    setStatus("success");

    setTimeout(() => {
      window.location.href = redirectTo;
    }, 3000);
  }, [navigate, setCookie]);

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Login Failed</AlertDescription>
      </Alert>
    );
  }

  if (status === "success") {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Login Successful</AlertTitle>
        <AlertDescription>Redirecting to homepage...</AlertDescription>
      </Alert>
    );
  }

  return <p>Loading...</p>;
}
