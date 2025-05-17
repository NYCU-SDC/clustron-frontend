export type JwtPayload = {
  id: string;
  username: string;
  email: string;
  studentId: string;
  accessLevel: string;
  role: string;
  iat?: number;
  exp?: number;
};
