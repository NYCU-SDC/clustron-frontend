export type JwtPayload = {
  ID: string;
  Username: string;
  Email: string;
  Role: string;
  iat?: number;
  exp?: number;
};
