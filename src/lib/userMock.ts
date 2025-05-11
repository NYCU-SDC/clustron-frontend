export type User = {
  id: string;
  username: string;
  email: string;
  studentId: string;
  dept: string;
  role:
    | "Admin"
    | "Professor"
    | "Teacher"
    | "Teacher assistant"
    | "Student"
    | "Auditor";
  accessLevel: "admin" | "organizer" | "groupAdmin" | "user";
};

export const mockUsers: User[] = [
  {
    id: "u001",
    username: "王小明",
    email: "liam@gmail.com",
    studentId: "113999321",
    accessLevel: "user",
    role: "Student",
    dept: "CS",
  },
  {
    id: "u002",
    username: "Olivia Smith",
    email: "olivia@gmail.com",
    studentId: "113000111",
    accessLevel: "user",
    role: "Student",
    dept: "EE",
  },
  {
    id: "u003",
    username: "Emma Brown",
    email: "emma.brown@gmail.com",
    studentId: "114000222",
    accessLevel: "user",
    role: "Student",
    dept: "MS",
  },
  {
    id: "u004",
    username: "張偉",
    email: "wei.zhang@gmail.com",
    studentId: "115000333",
    accessLevel: "groupAdmin",
    role: "Teacher assistant",
    dept: "CS",
  },
  {
    id: "u005",
    username: "John Chen",
    email: "john.chen@gmail.com",
    studentId: "116000444",
    accessLevel: "user",
    role: "Student",
    dept: "EE",
  },
  {
    id: "u006",
    username: "陳美麗",
    email: "mei.chen@gmail.com",
    studentId: "117000555",
    accessLevel: "organizer",
    role: "Teacher",
    dept: "MS",
  },
  {
    id: "u007",
    username: "Alice Johnson",
    email: "alice.j@gmail.com",
    studentId: "118000666",
    accessLevel: "admin",
    role: "Admin",
    dept: "CS",
  },
  {
    id: "u008",
    username: "Bob Lee",
    email: "bob.lee@gmail.com",
    studentId: "119000777",
    accessLevel: "user",
    role: "Student",
    dept: "EE",
  },
  {
    id: "u009",
    username: "林志玲",
    email: "chiling.lin@gmail.com",
    studentId: "120000888",
    accessLevel: "organizer",
    role: "Teacher",
    dept: "MS",
  },
  {
    id: "u010",
    username: "Henry Wang",
    email: "henry.wang@gmail.com",
    studentId: "121000999",
    accessLevel: "user",
    role: "Student",
    dept: "CS",
  },
];

export function findUserByIdOrEmail(input: string) {
  return (
    mockUsers.find((u) => u.email === input || u.studentId === input) ?? null
  );
}
