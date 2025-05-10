// src/context/UserContext.tsx
import { createContext, useContext, useState } from "react";
import { Member, mockGroups } from "@/lib/mockGroups";
import { mockUsers } from "@/lib/userMock";
type UserContextType = {
  user: Member | null;
  login: (studentId: string) => boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);

  const login = (studentId: string) => {
    for (const group of mockGroups) {
      const found = group.members.find((m) => m.studentId === studentId);
      if (found) {
        setUser(found);
        return true;
      }
    }

    const fallback = mockUsers.find((u) => u.studentId === studentId);
    if (fallback) {
      const fallbackMember: Member = {
        id: fallback.id,
        username: fallback.username,
        email: fallback.email,
        studentId: fallback.studentId,
        dept: fallback.dept,
        role: fallback.role as Member["role"], // 只取 student / teacher / TA 的 subset
        accessLevel: fallback.accessLevel,
      };
      setUser(fallbackMember);
      return true;
    }

    return false;
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("Must use within <UserProvider>");
  return ctx;
}
