// src/context/UserContext.tsx
import { createContext, useContext, useState } from "react";
import { Member, mockGroups } from "@/lib/mockGroups";
import { mockUsers } from "@/lib/userMock";

type UserContextType = {
  user: Member | null;
  setUser: (user: Member) => void; // ✅ 新增：直接設定使用者（JWT 解完後用）
  login: (studentId: string) => boolean; // ✅ 保留：舊登入邏輯（學號）
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);

  const login = (studentId: string): boolean => {
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
        role: fallback.role as Member["role"],
        accessLevel: fallback.accessLevel,
      };
      setUser(fallbackMember);
      return true;
    }

    return false;
  };

  return (
    <UserContext.Provider value={{ user, setUser, login }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("Must use within <UserProvider>");
  return ctx;
}
