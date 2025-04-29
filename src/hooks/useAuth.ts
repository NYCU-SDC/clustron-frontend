import { useContext } from "react";
import { authContext } from "@/lib/auth/authContext";
import { AuthContextType } from "@/types/type";

export const useAuth = (): AuthContextType => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
