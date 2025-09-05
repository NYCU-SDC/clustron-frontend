import { useState, useEffect } from "react";

export interface UseAutocompleteResult<T> {
  query: string;
  setQuery: (q: string) => void;
  suggestions: T[];
  showSuggestions: boolean;
  handleSelect: (item: T) => void;
}

export const useUserAutocomplete = <T = string>(
  apiEndpoint: string,
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
        // 👇 build request with query param
        const response = await fetch(
          `${apiEndpoint}?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data: T[] = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Fetch error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, delay);
    return () => clearTimeout(debounce);
  }, [query, apiEndpoint, delay]);

  const handleSelect = (item: T) => {
    setQuery(String(item));
    setShowSuggestions(false);
  };

  return { query, setQuery, suggestions, showSuggestions, handleSelect };
};
