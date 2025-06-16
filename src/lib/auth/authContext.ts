import { createContext } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { AuthCookie } from "@/types/type";

type AuthContextType = {
  login: (provider: "google" | "nycu") => void;
  setCookiesForAuthToken: (data: AuthCookie) => void;
  logout: () => void;
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

  logout: () => {
    console.warn("logout() called without provider");
  },

  isLoggedIn: () => {
    console.warn("isLoggedIn() called without AuthProvider");
    return false;
  },

  refreshMutation: {} as UseMutationResult<AuthCookie, Error, void, unknown>,
});
