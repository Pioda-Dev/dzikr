import { useState, useEffect } from "react";
import { Check, Globe } from "lucide-react";
import { getCurrentLanguage, setLanguage, t } from "../../lib/i18n";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
];

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);

    // Reload the page to apply language changes
    window.location.reload();
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Globe className="h-5 w-5 mr-2 text-emerald-600" />
          {t("settings.language")}
        </h2>
      </div>

      <div className="space-y-2">
        {languages.map((language) => (
          <div
            key={language.code}
            className={`p-3 rounded-md cursor-pointer flex items-center ${currentLang === language.code ? "bg-emerald-100 border border-emerald-300" : "bg-slate-50 hover:bg-slate-100 border border-slate-200"}`}
            onClick={() => handleLanguageChange(language.code)}
          >
            <div className="flex-1">
              <p className="font-medium">
                <span className="mr-2">{language.flag}</span>
                {language.nativeName}
              </p>
            </div>
            {currentLang === language.code && (
              <Check className="h-4 w-4 text-emerald-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
