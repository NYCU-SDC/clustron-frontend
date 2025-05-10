// src/lib/mockGroups.ts

export type Member = {
  id: string;
  username: string;
  email: string;
  studentId: string;
  dept: string;
  role: "student" | "teacher" | "teacherAssistant";
  accessLevel: "admin" | "organizer" | "groupAdmin" | "user";
};

export type Group = {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  members: Member[];
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
        username: "王小明",
        email: "liam@gmail.com",
        studentId: "113999321",
        dept: "CS",
        role: "student",
        accessLevel: "user",
      },
      {
        id: "u002",
        username: "Olivia Smith",
        email: "olivia@gmail.com",
        studentId: "113000111",
        dept: "CS",
        role: "student",
        accessLevel: "user",
      },
      {
        id: "u005",
        username: "John Chen",
        email: "john.chen@gmail.com",
        studentId: "116000444",
        accessLevel: "groupAdmin",
        role: "teacher",
        dept: "EE",
      },
    ],
  },
  {
    id: "ee201",
    title: "EE 201 - Circuits and Electronics",
    description: "EE fundamentals and labs.",
    isArchived: false,
    members: [
      {
        id: "u003",
        username: "Emma Brown",
        email: "emma@gmail.com",
        studentId: "110000111",
        dept: "CS",
        role: "teacher",
        accessLevel: "organizer",
      },
      {
        id: "u002",
        username: "Olivia Smith",
        email: "olivia@gmail.com",
        studentId: "113000111",
        dept: "CS",
        role: "student",
        accessLevel: "user",
      },
      {
        id: "u005",
        username: "John Chen",
        email: "john.chen@gmail.com",
        studentId: "116000444",
        accessLevel: "user",
        role: "student",
        dept: "EE",
      },
    ],
  },
  {
    id: "ee203",
    title: "EE 203 - Circuits and Electronics",
    description: "EECS fundamentals and labs.",
    isArchived: false,
    members: [
      {
        id: "u003",
        username: "Emma Brown",
        email: "emma@gmail.com",
        studentId: "110000111",
        dept: "CS",
        role: "teacher",
        accessLevel: "organizer",
      },
      {
        id: "u005",
        username: "John Chen",
        email: "john.chen@gmail.com",
        studentId: "116000444",
        accessLevel: "organizer",
        role: "teacherAssistant",
        dept: "EE",
      },
    ],
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
