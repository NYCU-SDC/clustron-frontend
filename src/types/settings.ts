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
    provider: "google" | "nycu";
    email: string;
  }[];
};

export type fullSettings = Settings & boundLoginMethods;

export type BindLoginRespose = {
  url: string;
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
  memory: number;
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
  status: JobState[];
  resource: ("cpu" | "gpu")[];
  partition: string[];
}
