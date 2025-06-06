import { getToken } from "@/lib/token";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `API Error (${res.status})`;
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // ignore
    }

    console.error("❌ [api] Error:", errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
}
