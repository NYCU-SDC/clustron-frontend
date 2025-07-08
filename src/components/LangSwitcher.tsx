import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = {
  en: "English",
  zh: "繁體中文",
} as const;

type LanguageCode = keyof typeof LANGUAGES;

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<LanguageCode>("zh");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as LanguageCode;
    const initialLang =
      storedLang && LANGUAGES[storedLang]
        ? storedLang
        : (i18n.language as LanguageCode);
    if (LANGUAGES[initialLang]) {
      setCurrentLang(initialLang);
      if (i18n.language !== initialLang) {
        i18n.changeLanguage(initialLang);
      }
    }
  }, [i18n]);

  const changeLanguage = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Globe className="h-4 w-4" />
          {LANGUAGES[currentLang] || LANGUAGES.zh}
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code as LanguageCode)}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
