import { BackgroundOption } from "./backgrounds";

// Types for saved dhikr
export interface SavedDhikr {
  id: number;
  name: string;
  targetCount: number;
  color: string;
  lastUsed: string;
  completedCount: number;
}

// Types for dhikr history
export interface DhikrHistory {
  id: number;
  dhikrId: number;
  dhikrName: string;
  count: number;
  targetCount: number;
  date: string;
  time: string;
}

// Local storage keys
const SAVED_DHIKR_KEY = "digital-tasbih-saved-dhikr";
const DHIKR_HISTORY_KEY = "digital-tasbih-history";
const BACKGROUND_KEY = "digital-tasbih-background";
const LOCATION_KEY = "digital-tasbih-location";
const THEME_KEY = "digital-tasbih-theme";
const QURAN_BOOKMARKS_KEY = "digital-tasbih-quran-bookmarks";
const QURAN_PROGRESS_KEY = "digital-tasbih-quran-progress";

// Default dhikr list
const defaultDhikrs: SavedDhikr[] = [
  {
    id: 1,
    name: "Subhanallah",
    targetCount: 33,
    color: "#10b981",
    lastUsed: "Today",
    completedCount: 12,
  },
  {
    id: 2,
    name: "Alhamdulillah",
    targetCount: 33,
    color: "#3b82f6",
    lastUsed: "Yesterday",
    completedCount: 8,
  },
  {
    id: 3,
    name: "Allahu Akbar",
    targetCount: 34,
    color: "#8b5cf6",
    lastUsed: "3 days ago",
    completedCount: 5,
  },
];

// Get saved dhikr from local storage
export const getSavedDhikr = (): SavedDhikr[] => {
  try {
    const savedDhikrJson = localStorage.getItem(SAVED_DHIKR_KEY);
    if (savedDhikrJson) {
      return JSON.parse(savedDhikrJson);
    }
    // If no saved dhikr, return defaults and save them
    localStorage.setItem(SAVED_DHIKR_KEY, JSON.stringify(defaultDhikrs));
    return defaultDhikrs;
  } catch (error) {
    console.error("Error getting saved dhikr:", error);
    return defaultDhikrs;
  }
};

// Save dhikr to local storage
export const saveDhikr = (dhikr: SavedDhikr): SavedDhikr[] => {
  try {
    const savedDhikrs = getSavedDhikr();

    // Check if dhikr already exists
    const existingIndex = savedDhikrs.findIndex((d) => d.id === dhikr.id);

    if (existingIndex >= 0) {
      // Update existing dhikr
      savedDhikrs[existingIndex] = {
        ...dhikr,
        lastUsed: "Today",
      };
    } else {
      // Add new dhikr with a new ID
      const newId = Math.max(0, ...savedDhikrs.map((d) => d.id)) + 1;
      savedDhikrs.push({
        ...dhikr,
        id: newId,
        lastUsed: "Today",
      });
    }

    localStorage.setItem(SAVED_DHIKR_KEY, JSON.stringify(savedDhikrs));
    return savedDhikrs;
  } catch (error) {
    console.error("Error saving dhikr:", error);
    return getSavedDhikr();
  }
};

// Delete a dhikr
export const deleteDhikr = (id: number): SavedDhikr[] => {
  try {
    const savedDhikrs = getSavedDhikr();
    const updatedDhikrs = savedDhikrs.filter((d) => d.id !== id);
    localStorage.setItem(SAVED_DHIKR_KEY, JSON.stringify(updatedDhikrs));
    return updatedDhikrs;
  } catch (error) {
    console.error("Error deleting dhikr:", error);
    return getSavedDhikr();
  }
};

// Update dhikr completion count
export const updateDhikrCompletionCount = (id: number): SavedDhikr[] => {
  try {
    const savedDhikrs = getSavedDhikr();
    const updatedDhikrs = savedDhikrs.map((dhikr) => {
      if (dhikr.id === id) {
        return {
          ...dhikr,
          completedCount: dhikr.completedCount + 1,
          lastUsed: "Today",
        };
      }
      return dhikr;
    });

    localStorage.setItem(SAVED_DHIKR_KEY, JSON.stringify(updatedDhikrs));
    return updatedDhikrs;
  } catch (error) {
    console.error("Error updating dhikr completion count:", error);
    return getSavedDhikr();
  }
};

// Get dhikr history
export const getDhikrHistory = (): DhikrHistory[] => {
  try {
    // Try localStorage first
    let historyJson = localStorage.getItem(DHIKR_HISTORY_KEY);

    // If not in localStorage, try sessionStorage as fallback
    if (!historyJson) {
      historyJson = sessionStorage.getItem(DHIKR_HISTORY_KEY);
      if (historyJson) {
        console.log("Retrieved dhikr history from sessionStorage fallback");
        // Move from sessionStorage to localStorage if possible
        try {
          localStorage.setItem(DHIKR_HISTORY_KEY, historyJson);
          sessionStorage.removeItem(DHIKR_HISTORY_KEY);
        } catch (moveError) {
          console.error(
            "Could not move history from sessionStorage to localStorage",
            moveError,
          );
        }
      } else {
        // Try to get from cookies as last resort
        try {
          const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith(DHIKR_HISTORY_KEY))
            ?.split("=")[1];

          if (cookieValue) {
            historyJson = decodeURIComponent(cookieValue);
            console.log("Retrieved dhikr history from cookies");

            // Try to move to localStorage
            try {
              localStorage.setItem(DHIKR_HISTORY_KEY, historyJson);
              // Clear the cookie by setting expiration in the past
              document.cookie = `${DHIKR_HISTORY_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            } catch (moveError) {
              console.error(
                "Could not move history from cookies to localStorage",
                moveError,
              );
            }
          }
        } catch (cookieError) {
          console.error("Error retrieving from cookies:", cookieError);
        }
      }
    }

    if (historyJson) {
      const parsedHistory = JSON.parse(historyJson);
      // Ensure it's an array
      if (Array.isArray(parsedHistory)) {
        return parsedHistory;
      } else {
        console.error("Dhikr history is not an array", parsedHistory);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error("Error getting dhikr history:", error);
    return [];
  }
};

// Add dhikr to history
export const addDhikrToHistory = (
  dhikr: SavedDhikr,
  count: number,
): DhikrHistory[] => {
  try {
    // Save all dhikr counts to history, regardless of the count value
    const history = getDhikrHistory();
    const now = new Date();

    const newHistoryEntry: DhikrHistory = {
      id: Date.now(),
      dhikrId: dhikr.id,
      dhikrName: dhikr.name,
      count,
      targetCount: dhikr.targetCount,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [newHistoryEntry, ...history];

    // Force save to localStorage with multiple attempts
    let saveSuccess = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        localStorage.setItem(DHIKR_HISTORY_KEY, JSON.stringify(updatedHistory));
        // Verify the data was saved correctly
        const savedData = localStorage.getItem(DHIKR_HISTORY_KEY);
        if (savedData) {
          saveSuccess = true;
          console.log("Successfully saved dhikr history to localStorage");
          break;
        }
      } catch (storageError) {
        console.error(
          `Error saving to localStorage (attempt ${attempt + 1}):`,
          storageError,
        );
      }
    }

    // If localStorage fails after all attempts, try sessionStorage as fallback
    if (!saveSuccess) {
      try {
        sessionStorage.setItem(
          DHIKR_HISTORY_KEY,
          JSON.stringify(updatedHistory),
        );
        console.log("Saved dhikr history to sessionStorage as fallback");
      } catch (sessionError) {
        console.error("Error saving to sessionStorage:", sessionError);

        // Last resort: try to save to a cookie
        try {
          document.cookie = `${DHIKR_HISTORY_KEY}=${encodeURIComponent(JSON.stringify(updatedHistory.slice(0, 5)))}; max-age=31536000; path=/`;
          console.log("Saved recent dhikr history to cookies as last resort");
        } catch (cookieError) {
          console.error("Error saving to cookies:", cookieError);
        }
      }
    }

    // Always update completion count if it's a saved dhikr (not a temporary one)
    // This ensures all dhikr counts are recorded
    if (dhikr.id < 1000000000) {
      // Assume temporary IDs are large timestamps
      updateDhikrCompletionCount(dhikr.id);
    }

    return updatedHistory;
  } catch (error) {
    console.error("Error adding dhikr to history:", error);
    return getDhikrHistory();
  }
};

// Clear all dhikr history
export const clearDhikrHistory = (): void => {
  try {
    // Clear from all possible storage locations
    localStorage.removeItem(DHIKR_HISTORY_KEY);
    sessionStorage.removeItem(DHIKR_HISTORY_KEY);
    document.cookie = `${DHIKR_HISTORY_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log("Cleared dhikr history from all storage locations");
  } catch (error) {
    console.error("Error clearing dhikr history:", error);
  }
};

// Export dhikr history to a JSON file
export const exportDhikrHistory = async (): Promise<void> => {
  try {
    const history = getDhikrHistory();
    const historyJson = JSON.stringify(history, null, 2);
    const blob = new Blob([historyJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhikr-history-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    return new Promise((resolve) => {
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 100);
    });
  } catch (error) {
    console.error("Error exporting dhikr history:", error);
    throw error;
  }
};

// Import dhikr history from a JSON file
export const importDhikrHistory = (jsonContent: string): void => {
  try {
    const importedHistory = JSON.parse(jsonContent);

    // Validate the imported data
    if (!Array.isArray(importedHistory)) {
      throw new Error("Invalid history format: not an array");
    }

    // Check if each item has the required properties
    for (const item of importedHistory) {
      if (!item.id || !item.dhikrName || typeof item.count !== "number") {
        throw new Error("Invalid history item format");
      }
    }

    // Merge with existing history (avoid duplicates by ID)
    const existingHistory = getDhikrHistory();
    const existingIds = new Set(existingHistory.map((item) => item.id));

    const newItems = importedHistory.filter(
      (item) => !existingIds.has(item.id),
    );
    const mergedHistory = [...existingHistory, ...newItems];

    // Sort by ID (newest first)
    mergedHistory.sort((a, b) => {
      if (typeof a.id === "number" && typeof b.id === "number") {
        return b.id - a.id;
      } else {
        // Handle string IDs by comparing them as dates if possible
        const aTime = new Date(`${a.date} ${a.time}`).getTime();
        const bTime = new Date(`${b.date} ${b.time}`).getTime();
        if (!isNaN(aTime) && !isNaN(bTime)) {
          return bTime - aTime;
        }
        // Fallback to string comparison
        return String(b.id).localeCompare(String(a.id));
      }
    });

    localStorage.setItem(DHIKR_HISTORY_KEY, JSON.stringify(mergedHistory));
  } catch (error) {
    console.error("Error importing dhikr history:", error);
    throw error;
  }
};

// Save selected background
export const saveSelectedBackground = (background: BackgroundOption): void => {
  try {
    localStorage.setItem(BACKGROUND_KEY, JSON.stringify(background));
  } catch (error) {
    console.error("Error saving background:", error);
  }
};

// Get selected background
export const getSelectedBackground = (): BackgroundOption | null => {
  try {
    const backgroundJson = localStorage.getItem(BACKGROUND_KEY);
    if (backgroundJson) {
      return JSON.parse(backgroundJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting background:", error);
    return null;
  }
};

// Save location
export const saveLocation = (location: any): void => {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  } catch (error) {
    console.error("Error saving location:", error);
  }
};

// Get saved location
export const getSavedLocation = (): any => {
  try {
    const locationJson = localStorage.getItem(LOCATION_KEY);
    if (locationJson) {
      return JSON.parse(locationJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};

// Clock settings keys
const CLOCK_SETTINGS_KEY = "digital-tasbih-clock-settings";
const CALCULATION_METHOD_KEY = "digital-tasbih-calculation-method";

// Save clock settings
export const saveClockSettings = (settings: any): void => {
  try {
    localStorage.setItem(CLOCK_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving clock settings:", error);
  }
};

// Get clock settings
export const getClockSettings = (): any => {
  try {
    const settingsJson = localStorage.getItem(CLOCK_SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting clock settings:", error);
    return null;
  }
};

// Save calculation method
export const saveCalculationMethod = (methodId: number): void => {
  try {
    localStorage.setItem(CALCULATION_METHOD_KEY, JSON.stringify(methodId));
  } catch (error) {
    console.error("Error saving calculation method:", error);
  }
};

// Get calculation method
export const getCalculationMethod = (): number | null => {
  try {
    const methodJson = localStorage.getItem(CALCULATION_METHOD_KEY);
    if (methodJson) {
      return JSON.parse(methodJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting calculation method:", error);
    return null;
  }
};

// Save theme preference
export const saveThemePreference = (isDarkMode: boolean): void => {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify({ isDarkMode }));
  } catch (error) {
    console.error("Error saving theme preference:", error);
  }
};

// Get theme preference
export const getThemePreference = (): { isDarkMode: boolean } => {
  try {
    const themeJson = localStorage.getItem(THEME_KEY);
    if (themeJson) {
      return JSON.parse(themeJson);
    }
    // Default to system preference or light mode
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return { isDarkMode: prefersDark };
  } catch (error) {
    console.error("Error getting theme preference:", error);
    return { isDarkMode: false };
  }
};

// Quran bookmarks functions
export const getQuranBookmarks = (): {
  surah: number;
  ayah: number;
  timestamp: string;
}[] => {
  try {
    const bookmarksJson = localStorage.getItem(QURAN_BOOKMARKS_KEY);
    if (bookmarksJson) {
      return JSON.parse(bookmarksJson);
    }
    return [];
  } catch (error) {
    console.error("Error getting Quran bookmarks:", error);
    return [];
  }
};

export const saveQuranBookmark = (bookmark: {
  surah: number;
  ayah: number;
  timestamp: string;
}): void => {
  try {
    const bookmarks = getQuranBookmarks();
    // Check if bookmark already exists
    const existingIndex = bookmarks.findIndex(
      (b) => b.surah === bookmark.surah && b.ayah === bookmark.ayah,
    );

    let updatedBookmarks;
    if (existingIndex >= 0) {
      // Replace existing bookmark
      updatedBookmarks = [...bookmarks];
      updatedBookmarks[existingIndex] = bookmark;
    } else {
      // Add new bookmark
      updatedBookmarks = [...bookmarks, bookmark];
    }

    localStorage.setItem(QURAN_BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error("Error saving Quran bookmark:", error);
  }
};

export const removeQuranBookmark = (surah: number, ayah: number): void => {
  try {
    const bookmarks = getQuranBookmarks();
    const updatedBookmarks = bookmarks.filter(
      (b) => !(b.surah === surah && b.ayah === ayah),
    );
    localStorage.setItem(QURAN_BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error("Error removing Quran bookmark:", error);
  }
};

// Quran reading progress functions
export const saveQuranProgress = (surah: number, ayah: number): void => {
  try {
    const progress = {
      surah,
      ayah,
      lastRead: new Date().toISOString(),
    };
    localStorage.setItem(QURAN_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving Quran progress:", error);
  }
};

export const getQuranProgress = (): {
  surah: number;
  ayah: number;
  lastRead: string;
} | null => {
  try {
    const progressJson = localStorage.getItem(QURAN_PROGRESS_KEY);
    if (progressJson) {
      return JSON.parse(progressJson);
    }
    return null;
  } catch (error) {
    console.error("Error getting Quran progress:", error);
    return null;
  }
};

// Quran settings functions
const QURAN_SETTINGS_KEY = "digital-tasbih-quran-settings";

export interface QuranSettings {
  fontSize: number;
  translation: string;
  showArabic: boolean;
  lastTranslation: string;
}

export const getQuranSettings = (): QuranSettings => {
  try {
    const settingsJson = localStorage.getItem(QURAN_SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    // Default settings
    return {
      fontSize: 20,
      translation: "en.asad",
      showArabic: true,
      lastTranslation: "en.asad",
    };
  } catch (error) {
    console.error("Error getting Quran settings:", error);
    return {
      fontSize: 20,
      translation: "en.asad",
      showArabic: true,
      lastTranslation: "en.asad",
    };
  }
};

export const saveQuranSettings = (settings: Partial<QuranSettings>): void => {
  try {
    const currentSettings = getQuranSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(QURAN_SETTINGS_KEY, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error("Error saving Quran settings:", error);
  }
};
