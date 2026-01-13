import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/request/getUsers";
import type { GetUsersParams } from "@/types/admin";

export function useGetUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ["AdminUsers", params],
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev,
  });
}
