export function initiateOAuth() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL!;
  const FRONT_BASE = import.meta.env.VITE_FRONTEND_BASE_URL!;

  return (redirectTo?: string) => {
    const callbackUrl = `${FRONT_BASE}/login/callback`;
    const params = new URLSearchParams({ c: callbackUrl });
    if (redirectTo) params.set("r", redirectTo);

    const oauthUrl = `${API_BASE}/api/oauth2/google?${params}`;
    window.location.href = oauthUrl;
  };
}
