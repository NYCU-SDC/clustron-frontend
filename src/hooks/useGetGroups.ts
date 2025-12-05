import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/request/getGroups";

export function useGetGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
}
