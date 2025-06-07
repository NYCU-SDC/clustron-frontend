import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/request/getRoles";

export function useGroupRoles() {
  return useQuery({
    queryKey: ["groupRoles"],
    queryFn: getRoles,
  });
}
