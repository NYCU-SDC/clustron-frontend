import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm text-gray-500 hover:text-black border px-3 py-1 rounded"
    >
      {i18n.language === "zh" ? "Switch to English" : "切換成中文"}
    </button>
  );
}
