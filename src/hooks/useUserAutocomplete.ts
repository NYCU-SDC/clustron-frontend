import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUser, PaginatedResponse } from "@/lib/request/searchUser";

export interface SearchUserItem {
  identifier: string;
}

export interface UseAutocompleteResult<T> {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  suggestions: T[];
  showSuggestions: boolean;
  handleSelect: (item: T) => void;

  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoadingSuggestions: boolean;
  isError: boolean;
  error: Error | null;
}

export const useUserAutocomplete = <T extends SearchUserItem = SearchUserItem>(
  delay: number = 300,
): UseAutocompleteResult<T> => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [showSuggestionsInternal, setShowSuggestionsInternal] =
    useState<boolean>(false);

  // 防抖 (Debounce) 邏輯
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
  } = useInfiniteQuery<
    PaginatedResponse<T>,
    Error,
    PaginatedResponse<T>,
    (string | number)[],
    number
  >({
    queryKey: ["userAutocomplete", debouncedQuery],

    queryFn: ({ queryKey, pageParam }) => {
      const [, currentQuery] = queryKey;
      return searchUser<T>(currentQuery as string, pageParam as number);
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },

    enabled: !!debouncedQuery,

    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  const suggestions = data?.pages?.flatMap((page) => page.items) || [];

  const showSuggestions =
    showSuggestionsInternal &&
    ((isInitialLoading && !suggestions.length) ||
      suggestions.length > 0 ||
      isFetchingNextPage);

  const handleSelect = (item: T) => {
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
