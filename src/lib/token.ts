export function getToken(): string | null {
  return localStorage.getItem("jwtToken");
}

export function setToken(token: string): void {
  localStorage.setItem("jwtToken", token);
}

export function clearToken(): void {
  localStorage.removeItem("jwtToken");
}
