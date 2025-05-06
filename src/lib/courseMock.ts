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
  members: Member[];
};

export const mockGroups: Group[] = [
  {
    id: "cs101",
    title: "CS 101 - Intro to Computer Science",
    description: "This is the CS101 course. Welcome!",
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
        id: "u003",
        username: " Smith",
        email: "olivia@gmail.com",
        studentId: "113000111",
        dept: "CS",
        role: "teacher",
        accessLevel: "organizer",
      },
    ],
  },
  {
    id: "ee201",
    title: "EE 201 - Circuits and Electronics",
    description: "EE fundamentals and labs.",
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
    ],
  },
];

export function getGroupById(id: string): Group | null {
  return mockGroups.find((g) => g.id === id) ?? null;
}
export const courseList = mockGroups.map(({ id, title, description }) => ({
  id,
  title,
  desc: description,
}));

export function removeMemberFromGroup(groupId: string, memberId: string) {
  const group = mockGroups.find((g) => g.id === groupId);
  if (!group) return;

  group.members = group.members.filter((m) => m.id !== memberId);
}
