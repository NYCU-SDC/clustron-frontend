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
