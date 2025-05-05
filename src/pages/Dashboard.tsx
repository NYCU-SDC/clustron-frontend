import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { accessTokenType } from "@/types/type";
import { useCookies } from "react-cookie";
import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(authContext)!;
  const [cookies] = useCookies([
    "accessToken",
    "refreshTokenExpirationTime",
    "refreshToken",
  ]);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessExpiresAt, setAccessExpiresAt] = useState<string | null>(null);
  const [refreshExpiresAt, setRefreshExpiresAt] = useState<string | null>(null);

  const [accessCountdown, setAccessCountdown] = useState<number | null>(null);
  const [refreshCountdown, setRefreshCountdown] = useState<number | null>(null);

  useEffect(() => {
    const storedAccessToken = cookies.accessToken;
    const storedRefreshToken = cookies.refreshToken;
    const storedRefreshTokenExpirationTime = cookies.refreshTokenExpirationTime;
    if (
      !storedAccessToken ||
      !storedRefreshToken ||
      !storedRefreshTokenExpirationTime
    ) {
      navigate("/login");
      return;
    }
    const decodedAccess = jwtDecode<accessTokenType>(storedAccessToken);
    const accessExpMs = decodedAccess.exp * 1000;
    setAccessExpiresAt(new Date(accessExpMs).toLocaleString());
    setAccessToken(storedAccessToken);

    const refreshExpMs = storedRefreshTokenExpirationTime * 1000;
    setRefreshExpiresAt(new Date(refreshExpMs).toLocaleString());
    setRefreshToken(storedRefreshToken);

    const interval = setInterval(() => {
      const now = Date.now();
      setAccessCountdown(Math.max(0, Math.floor((accessExpMs - now) / 1000)));
      setRefreshCountdown(Math.max(0, Math.floor((refreshExpMs - now) / 1000)));
    }, 1000);
    {
      const now = Date.now();
      setAccessCountdown(Math.max(0, Math.floor((accessExpMs - now) / 1000)));
      setRefreshCountdown(Math.max(0, Math.floor((refreshExpMs - now) / 1000)));
    }

    return () => clearInterval(interval);
  }, [cookies.accessToken, cookies.refreshToken, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          登出
        </button>
      </div>

      {accessToken && refreshToken ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Access Token</h2>
            <p>
              <strong>Expires At: </strong>
              {accessExpiresAt}
            </p>
            <p>
              <strong>Expires In: </strong>
              {accessCountdown} 秒
            </p>
            <p className="text-sm text-gray-500 break-all">
              <strong>Token: </strong>
              <br />
              {accessToken}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Refresh Token</h2>
            <p>
              <strong>Expires At: </strong>
              {refreshExpiresAt}
            </p>
            <p>
              <strong>Expires In: </strong>
              {refreshCountdown} 秒
            </p>
            <p className="text-sm text-gray-500 break-all">
              <strong>Token:</strong>
              <br />
              {refreshToken}
            </p>
          </div>
        </div>
      ) : (
        <p>No token found</p>
      )}
    </div>
  );
}
