import { useState, useEffect } from "react";
import { searchUser } from "@/lib/request/searchUser.tsx";

export interface UseAutocompleteResult<T> {
  query: string;
  setQuery: (q: string) => void;
  suggestions: T[];
  showSuggestions: boolean;
  handleSelect: (item: T) => void;
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
        const responseData = await searchUser<T>(query);
        setSuggestions(responseData.items);
        setShowSuggestions(responseData.items.length > 0);
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
      displayValue = String((item as { identifier: unknown }).identifier);
    } else {
      displayValue = String(item);
    }
    setQuery(displayValue);
    setShowSuggestions(false);
  };

  return { query, setQuery, suggestions, showSuggestions, handleSelect };
};
