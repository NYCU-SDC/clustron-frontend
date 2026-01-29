import { getAccessToken } from "@/lib/token";

const RAW_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

if (!RAW_BASE_URL) {
  throw new Error("VITE_BACKEND_BASE_URL is not set");
}

const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

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

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const url = `${BASE_URL}${normalizedPath}`;

  const res = await fetch(url, {
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
  if (res.status === 204) {
    return { message: "success" } as T;
  }

  return res.json();
}
