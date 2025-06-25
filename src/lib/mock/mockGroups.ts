// src/lib/mockGroups.ts

export type Member = {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  role: "Admin" | "Group Owner" | "Teacher assistant" | "Student" | "Auditor";
  accessLevel: "Admin" | "Organizer" | "User";
};

export type Group = {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  members: Member[];
  createdAt: string;
  updatedAt: string;
};

export const mockGroups: Group[] = [
  {
    id: "cs101",
    title: "CS 101 - Intro to Computer Science",
    description: "This is the CS101 course. Welcome!",
    isArchived: false,
    members: [
      {
        id: "u001",
        fullName: "王小明",
        email: "liam@gmail.com",
        studentId: "113999321",
        role: "Student",
        accessLevel: "User",
      },
      {
        id: "u002",
        fullName: "Olivia Smith",
        email: "olivia@gmail.com",
        studentId: "113000111",
        role: "Student",
        accessLevel: "User",
      },
      {
        id: "u005",
        fullName: "John Chen",
        email: "john.chen@gmail.com",
        studentId: "116000444",
        accessLevel: "Organizer",
        role: "Group Owner",
      },
    ],
    createdAt: "20250000",
    updatedAt: "20250111",
  },
  {
    id: "ee201",
    title: "EE 201 - Circuits and Electronics",
    description: "EE fundamentals and labs.",
    isArchived: false,
    members: [
      {
        id: "u003",
        fullName: "Emma Brown",
        email: "emma@gmail.com",
        studentId: "110000111",
        role: "Group Owner",
        accessLevel: "Organizer",
      },
      {
        id: "u002",
        fullName: "Olivia Smith",
        email: "olivia@gmail.com",
        studentId: "113000111",
        role: "Student",
        accessLevel: "User",
      },
      {
        id: "u005",
        fullName: "John Chen",
        email: "john.chen@gmail.com",
        studentId: "116000444",
        accessLevel: "User",
        role: "Student",
      },
    ],
    createdAt: "20250820",
    updatedAt: "20250821",
  },
  {
    id: "ee203",
    title: "EE 203 - Circuits and Electronics",
    description: "EECS fundamentals and labs.",
    isArchived: false,
    members: [
      {
        id: "u003",
        fullName: "Emma Brown",
        email: "emma@gmail.com",
        studentId: "110000111",
        role: "Group Owner",
        accessLevel: "Organizer",
      },
      {
        id: "u005",
        fullName: "John Chen",
        email: "john.chen@gmail.com",
        studentId: "116000444",
        accessLevel: "Organizer",
        role: "Teacher assistant",
      },
      {
        id: "84f834c8-3388-4411-992c-b7b9a472d377",
        fullName: "何思儀",
        accessLevel: "User",
        studentId: "110700036",
        role: "Student",
        email: "annie10731303.mg10@nycu.edu.tw",
      },
    ],
    createdAt: "20250820",
    updatedAt: "20250821",
  },
];

export function getGroupById(id: string): Group | null {
  return mockGroups.find((g) => g.id === id) ?? null;
}

export function removeMemberFromGroup(groupId: string, memberId: string) {
  const group = mockGroups.find((g) => g.id === groupId);
  if (!group) return;
  group.members = group.members.filter((m) => m.id !== memberId);
}
