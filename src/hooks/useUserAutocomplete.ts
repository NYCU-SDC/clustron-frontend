import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUser } from "@/lib/request/searchUser";
import type { PaginatedResponse } from "@/types/group.ts";

export interface SearchUserItem {
  identifier: string;
}

export interface UseAutocompleteResult {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  suggestions: SearchUserItem[];
  showSuggestions: boolean;
  handleSelect: (item: SearchUserItem) => void;

  fetchNextPage: ReturnType<typeof useInfiniteQuery>["fetchNextPage"];
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoadingSuggestions: boolean;
  isError: boolean;
  error: Error | null;
}

export const useUserAutocomplete = (
  delay: number = 300,
): UseAutocompleteResult => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [showSuggestionsInternal, setShowSuggestionsInternal] =
    useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        setShowSuggestionsInternal(true);
      } else {
        setShowSuggestionsInternal(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInitialLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["userAutocomplete", debouncedQuery],

    queryFn: async ({
      queryKey,
      pageParam = 0,
    }: {
      queryKey: readonly (string | number)[];
      pageParam?: number;
    }) => {
      const [, currentQuery] = queryKey;
      return await searchUser(currentQuery as string, pageParam);
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage: PaginatedResponse<SearchUserItem>) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },

    enabled: !!debouncedQuery,

    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const suggestions: SearchUserItem[] =
    data?.pages?.flatMap(
      (page: PaginatedResponse<SearchUserItem>) => page.items,
    ) || [];

  const showSuggestions =
    showSuggestionsInternal &&
    ((isInitialLoading && !suggestions.length) ||
      suggestions.length > 0 ||
      isFetchingNextPage);

  const handleSelect = (item: SearchUserItem) => {
    setQuery(item.identifier);
    setDebouncedQuery(item.identifier);
    setShowSuggestionsInternal(false);
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    suggestions,
    showSuggestions,
    handleSelect,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingSuggestions: isInitialLoading,
    isError,
    error,
  };
};
