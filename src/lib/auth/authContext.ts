import { createContext } from "react";

type AuthContextType = {
  login: () => void;
  logout: () => void;
};

export const authContext = createContext<AuthContextType | undefined>(
  undefined,
);
