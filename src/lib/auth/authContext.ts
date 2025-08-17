import { createContext } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { AuthCookie } from "@/types/settings";

type AuthContextType = {
  login: (provider: "google" | "nycu") => void;
  setCookiesForAuthToken: (data: AuthCookie) => void;
  handleLogout: () => void;
  isLoggedIn: () => boolean;
  refreshMutation: UseMutationResult<AuthCookie, Error, void, unknown>;
};

export const authContext = createContext<AuthContextType>({
  login: () => {
    console.warn("login() called without provider");
  },

  setCookiesForAuthToken: () => {
    console.warn("setCookiesForAuthToken() called without provider");
  },

  handleLogout: () => {
    console.warn("logout() called without provider");
  },

  isLoggedIn: () => {
    console.warn("isLoggedIn() called without AuthProvider");
    return false;
  },

  refreshMutation: {} as UseMutationResult<AuthCookie, Error, void, unknown>,
});
