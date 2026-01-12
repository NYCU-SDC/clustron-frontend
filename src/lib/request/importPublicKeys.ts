import { api } from "@/lib/request/api";

interface ImportResponse {
  url: string;
}

export const importPublicKeys = () => {
  return api<ImportResponse>(`/api/publickey/import?r=${window.location.href}`);
};
