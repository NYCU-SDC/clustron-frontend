export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}
export const removeToken = () => {
  localStorage.removeItem("token"); // 或根據你實際儲存的 key
};
