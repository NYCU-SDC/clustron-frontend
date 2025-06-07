// src/lib/token.ts
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export function getAccessToken(): string | null {
  return cookies.get("accessToken") ?? null;
}

export function getRefreshToken(): string | null {
  return cookies.get("refreshToken") ?? null;
}

//TODO
