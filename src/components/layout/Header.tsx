import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { saveThemePreference, getThemePreference } from "../../lib/storage";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme preference on mount
    const { isDarkMode: savedDarkMode } = getThemePreference();
    setIsDarkMode(savedDarkMode);

    // Apply theme to document
    applyTheme(savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    saveThemePreference(newDarkMode);
    applyTheme(newDarkMode);
  };

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="w-full bg-white dark:bg-slate-800 shadow-sm p-4 flex justify-between items-center transition-colors duration-200">
      <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-500">
        Digital Tasbih
      </h1>
      <button
        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-slate-700" />
        )}
      </button>
    </header>
  );
};

export default Header;
