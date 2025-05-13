import { createContext } from "react";

type AuthContextType = {
  login: (provider: "google" | "nycu") => void;
  logout: () => void;
};

export const authContext = createContext<AuthContextType | undefined>(
  undefined,
);
