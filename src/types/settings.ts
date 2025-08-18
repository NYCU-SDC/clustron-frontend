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

export type boundLoginMethods = {
  boundLoginMethods: {
    provider: "GOOGLE" | "NYCU";
    email: string;
  }[];
};

export type fullSettings = Settings & boundLoginMethods;

export type BindLoginRespose = {
  url: string;
};
