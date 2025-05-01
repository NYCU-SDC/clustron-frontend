export type JWTPayload = {
  username: string;
  role: string;
  exp: number;
};

export type AuthContextType = {
  login: () => void;
  logout: () => void;
};
