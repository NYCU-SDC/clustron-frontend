import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setIsEnglish(storedLang === "en");
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const toggleLanguage = (checked: boolean) => {
    const newLang = checked ? "en" : "zh";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setIsEnglish(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="lang-switch"
        checked={isEnglish}
        onCheckedChange={toggleLanguage}
      />
      <Label htmlFor="lang-switch">{isEnglish ? "English" : "繁體中文"}</Label>
    </div>
  );
}
