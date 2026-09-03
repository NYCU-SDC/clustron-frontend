import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/request/getGroups";

export function useGetGroups(page = 0) {
  return useQuery({
    queryKey: ["groups", page],
    queryFn: () => getGroups(page),
    placeholderData: (previousData) => previousData,
  });
}
