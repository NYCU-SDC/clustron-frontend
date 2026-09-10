import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";

type SettingsData = Awaited<ReturnType<typeof getSettings>>;

type UseGetSettingsOptions = Omit<
  UseQueryOptions<SettingsData, Error>,
  "queryKey" | "queryFn"
>;

export const SETTINGS_QUERY_KEY = ["settings"] as const;

export function useGetSettings(options?: UseGetSettingsOptions) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettings,
    ...options,
  });
}
