export type AccessToken = {
  ID: string;
  Username: string;
  Email: string;
  Role: string;
  iss: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
};

export type PublicKey = {
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
  username: string;
  linuxUsername: string;
};
