export type User = {
  id: string;
  username: string;
  email: string;
  studentId: string;
  role:
    | "Admin"
    | "Professor"
    | "Teacher"
    | "Teacher assistant"
    | "Student"
    | "Auditor";
  accessLevel: "Admin" | "Organizer" | "User";
};

export const mockUsers: User[] = [
  {
    id: "u001",
    username: "王小明",
    email: "liam@gmail.com",
    studentId: "113999321",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u002",
    username: "Olivia Smith",
    email: "olivia@gmail.com",
    studentId: "113000111",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u003",
    username: "Emma Brown",
    email: "emma.brown@gmail.com",
    studentId: "114000222",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u004",
    username: "張偉",
    email: "wei.zhang@gmail.com",
    studentId: "115000333",
    accessLevel: "Organizer",
    role: "Teacher assistant",
  },
  {
    id: "u005",
    username: "John Chen",
    email: "john.chen@gmail.com",
    studentId: "116000444",
    accessLevel: "Organizer",
    role: "Teacher",
  },
  {
    id: "u006",
    username: "陳美麗",
    email: "mei.chen@gmail.com",
    studentId: "117000555",
    accessLevel: "Organizer",
    role: "Teacher",
  },
  {
    id: "u007",
    username: "Alice Johnson",
    email: "alice.j@gmail.com",
    studentId: "118000666",
    accessLevel: "Admin",
    role: "Admin",
  },
  {
    id: "u008",
    username: "Bob Lee",
    email: "bob.lee@gmail.com",
    studentId: "119000777",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u009",
    username: "林志玲",
    email: "chiling.lin@gmail.com",
    studentId: "120000888",
    accessLevel: "Organizer",
    role: "Teacher",
  },
  {
    id: "u010",
    username: "Henry Wang",
    email: "henry.wang@gmail.com",
    studentId: "121000999",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u011",
    username: "王大仁",
    email: "darenn.wang@gmail.com",
    studentId: "122001000",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u012",
    username: "Sophia Liu",
    email: "sophia.liu@gmail.com",
    studentId: "123001111",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u013",
    username: "陳俊宏",
    email: "junhong.chen@gmail.com",
    studentId: "124001222",
    accessLevel: "Organizer",
    role: "Teacher assistant",
  },
  {
    id: "u014",
    username: "Ethan Kim",
    email: "ethan.kim@gmail.com",
    studentId: "125001333",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u015",
    username: "劉思敏",
    email: "simin.liu@gmail.com",
    studentId: "126001444",
    accessLevel: "Organizer",
    role: "Teacher",
  },
  {
    id: "u016",
    username: "Liam Davis",
    email: "liam.davis@gmail.com",
    studentId: "127001555",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u017",
    username: "Emily Wu",
    email: "emily.wu@gmail.com",
    studentId: "128001666",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u018",
    username: "張宇",
    email: "yu.zhang@gmail.com",
    studentId: "129001777",
    accessLevel: "Organizer",
    role: "Teacher assistant",
  },
  {
    id: "u019",
    username: "Noah Clark",
    email: "noah.clark@gmail.com",
    studentId: "130001888",
    accessLevel: "User",
    role: "Student",
  },
  {
    id: "u020",
    username: "李靜雯",
    email: "jingwen.li@gmail.com",
    studentId: "131001999",
    accessLevel: "Organizer",
    role: "Teacher",
  },
  {
    id: "84f834c8-3388-4411-992c-b7b9a472d377",
    username: "何思儀",
    accessLevel: "Organizer",
    studentId: "110700036",
    role: "Student",
    email: "annie10731303.mg10@nycu.edu.tw",
  },
];

export function findUserByIdOrEmail(input: string) {
  return (
    mockUsers.find((u) => u.email === input || u.studentId === input) ?? null
  );
}
