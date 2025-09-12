import { useState, useEffect } from "react";
import { api } from "@/lib/request/api";

export interface UseAutocompleteResult<T> {
  query: string;
  setQuery: (q: string) => void;
  suggestions: T[];
  showSuggestions: boolean;
  handleSelect: (item: T) => void;
}

interface PaginatedResponse<ItemType> {
  items: ItemType[];
  currentPage: number;
  hasNextPage: boolean;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const useUserAutocomplete = <T = string>(
  delay: number = 300,
): UseAutocompleteResult<T> => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const responseData: PaginatedResponse<T> = await api(
          `/api/searchUser?query=${encodeURIComponent(query)}`,
        );

        setSuggestions(responseData.items);
        if (responseData.items.length > 0) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, delay);
    return () => clearTimeout(debounce);
  }, [query, delay]);

  const handleSelect = (item: T) => {
    let displayValue: string;

    if (typeof item === "object" && item !== null && "identifier" in item) {
      // 修正點 1：用 as 關鍵字強制 TypeScript 相信 item 有 identifier
      // 意思就是「把 item 當作一個有 identifier 屬性的物件」
      displayValue = String((item as { identifier: unknown }).identifier);
    } else {
      displayValue = String(item);
    }
    setQuery(displayValue);
    setShowSuggestions(false);
  };

  return { query, setQuery, suggestions, showSuggestions, handleSelect };
};
