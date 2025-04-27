import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { setupAutoRefresh } from "@/components/auth/AuthService";

type JWTPayload = {
  username: string;
  role?: string;
  exp: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      const storedToken = localStorage.getItem("accessToken");
      if (!storedToken) {
        navigate("/login");
        return;
      }

      setToken(storedToken);

      try {
        const decoded = jwtDecode<JWTPayload>(storedToken);
        setUsername(decoded.username);

        const expTime = decoded.exp * 1000;
        setExpiresAt(new Date(expTime).toLocaleString());

        const secondsLeft = Math.floor((expTime - Date.now()) / 1000);
        setCountdown(secondsLeft);
        setupAutoRefresh(storedToken);

        const interval = setInterval(async () => {
          setCountdown((prev) => {
            if (prev && prev > 0) return prev - 1;
            return 0;
          });
        }, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate("/login");
      }
    }

    init();
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {token ? (
        <div className="space-y-3">
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Expires At:</strong> {expiresAt}
          </p>
          <p>
            <strong>Token expires in:</strong> {countdown} seconds
          </p>
          <p className="text-sm text-gray-500 break-all">
            <strong>Token:</strong>
            <br />
            {token}
          </p>
        </div>
      ) : (
        <p>No token found</p>
      )}
    </div>
  );
}
