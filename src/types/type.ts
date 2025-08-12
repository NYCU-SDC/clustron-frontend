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

//jobs
export type JobState =
  | "RUNNING"
  | "PENDING"
  | "FAILED"
  | "COMPLETED"
  | "TIMEOUT"
  | "CANCELLED";

export interface Resources {
  cpu: number;
  gpu: number;
  mem: number;
}

export interface Job {
  id: number;
  state: JobState;
  user: string;
  partition: string;
  resources: Resources;
}

export type SortBy = keyof Job | keyof Resources;

export interface FilterOptions {
  myJobs: boolean;
  status: JobState[];
  resource: (keyof Resources)[];
}
