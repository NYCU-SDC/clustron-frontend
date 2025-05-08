// src/context/GroupContext.tsx
import { createContext, useContext, useState } from "react";
import { Group, mockGroups } from "@/lib/mockGroups";

type GroupContextType = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
};

const GroupContext = createContext<GroupContextType | null>(null);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  return (
    <GroupContext.Provider value={{ groups, setGroups }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroupContext() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("Must use within <GroupProvider>");
  return ctx;
}
