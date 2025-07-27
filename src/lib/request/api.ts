import { getAccessToken } from "@/lib/token";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

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
    let errorStatus = res.status;
    let errorMessage = `API Error (${res.status})`;

    try {
      const error = await res.json();
      errorStatus = error.status || errorStatus;
      errorMessage = error.detail || errorMessage;
    } catch {
      // ignore
    }
    console.error("❌ [api] Error:", errorMessage);
    const err = new Error(errorMessage);
    err.name = errorStatus.toString();
    throw err;
  }

  // 204 means no content, so it will cause error when return res.json()
  // if (res.status === 204) {
  //   return null;
  // }

  return res.json();
}
