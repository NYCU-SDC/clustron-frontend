import { createContext } from "react";
import { AuthContextType } from "@/types/type";

export const authContext = createContext<AuthContextType | undefined>(
  undefined,
);
