import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import type { AccessTokenType } from "@/types/type";

export function useJwtPayload(): AccessTokenType | null {
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  if (!token) return null;

  try {
    return jwtDecode<AccessTokenType>(token);
  } catch {
    return null;
  }
}
