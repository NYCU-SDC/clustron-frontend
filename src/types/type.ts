export type JWTPayload = {
  username: string;
  role: string;
  exp: number;
};

export type AuthContextType = {
  login: (email: string) => Promise<boolean>;
  logout: () => void;
};
