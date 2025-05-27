// src/hooks/useGlobalRole.ts
import { jwtDecode } from "jwt-decode";
import type { AccessTokenType } from "@/types/type";
import { getAccessToken } from "@/lib/token";

export function useGlobalRole(): AccessTokenType["role"] | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = jwtDecode<AccessTokenType>(token);
    return payload.role;
  } catch (e) {
    return null;
  }
}

//TODO
