import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Callback() {
  const [, setCookie] = useCookies([
    "accessToken",
    "refreshTokenExpirationTime",
    "refreshToken",
  ]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");
    const redirectTo = params.get("r") || "/";

    if (!accessToken || !refreshToken) {
      setStatus("error");
      return;
    }

    setCookie("accessToken", accessToken, { path: "/" });
    setCookie("refreshToken", refreshToken, { path: "/" });
    setCookie(
      "refreshTokenExpirationTime",
      Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60,
      { path: "/" },
    );
    setStatus("success");

    setTimeout(() => {
      window.location.href = redirectTo;
    }, 1000);
  }, []);

  return (
    <div className="flex items-start min-h-screen p-2">
      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Login Failed</AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Login Successful</AlertTitle>
          <AlertDescription>Redirecting...</AlertDescription>
        </Alert>
      )}

      {status === "loading" && <p>Loading...</p>}
    </div>
  );
}
