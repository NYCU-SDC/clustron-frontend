import { createContext } from "react";

type AuthContextType = {
  login: (provider: "google" | "nycu") => void;
  setCookiesForAuthToken: (
    accessToken: string,
    refreshToken: string,
    refreshTokenExpirationTime?: number,
  ) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export const authContext = createContext<AuthContextType>({
  login: () => {
    console.warn("login() called without provider");
  },

  setCookiesForAuthToken: () => {
    console.warn("setCookiesForAuthToken() called without provider");
  },

  logout: () => {
    console.warn("logout() called without provider");
  },

  isLoggedIn: () => {
    console.warn("isLoggedIn() called without AuthProvider.");
    return false;
  },
});
