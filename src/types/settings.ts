export type AccessToken = {
  ID: string;
  FullName: string;
  Email: string;
  Role: string;
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
};

export type PublicKeyInfo = {
  id: string;
  title: string;
  publicKey: string;
};

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
};

export type Settings = {
  fullName: string;
  linuxUsername: string;
};

export type BoundLoginMethods = {
  boundLoginMethods: {
    provider: "google" | "nycu";
    email: string;
  }[];
};

export type BoundLoginRespose = {
  url: string;
};
