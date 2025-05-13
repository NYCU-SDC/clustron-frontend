export type JwtPayload = {
  id: string;
  username: string;
  email: string;
  studentId: string;
  accessLevel: string;
  role: string;
  dept: string;
  iat?: number;
  exp?: number;
};
