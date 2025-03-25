import { useState, useEffect, useRef } from "react";
import {
  Book,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  X,
  Volume2,
  Download,
  Share2,
  Info,
  List,
  Moon,
  Sun,
} from "lucide-react";
import {
  getQuranBookmarks,
  saveQuranBookmark,
  removeQuranBookmark,
  saveQuranProgress,
  getQuranProgress,
  getThemePreference,
  saveThemePreference,
} from "../../lib/storage";

interface QuranReaderProps {
  onClose: () => void;
}

// Surah info type
interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// List of all surahs with basic info
const surahList: SurahInfo[] = [
  {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatiha",
    englishNameTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan",
  },
  {
    number: 2,
    name: "البقرة",
    englishName: "Al-Baqarah",
    englishNameTranslation: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan",
  },
  {
    number: 3,
    name: "آل عمران",
    englishName: "Aal-Imran",
    englishNameTranslation: "The Family of Imran",
    numberOfAyahs: 200,
    revelationType: "Medinan",
  },
  {
    number: 4,
    name: "النساء",
    englishName: "An-Nisa",
    englishNameTranslation: "The Women",
    numberOfAyahs: 176,
    revelationType: "Medinan",
  },
  {
    number: 5,
    name: "المائدة",
    englishName: "Al-Ma'idah",
    englishNameTranslation: "The Table Spread",
    numberOfAyahs: 120,
    revelationType: "Medinan",
  },
  {
    number: 6,
    name: "الأنعام",
    englishName: "Al-An'am",
    englishNameTranslation: "The Cattle",
    numberOfAyahs: 165,
    revelationType: "Meccan",
  },
  {
    number: 7,
    name: "الأعراف",
    englishName: "Al-A'raf",
    englishNameTranslation: "The Heights",
    numberOfAyahs: 206,
    revelationType: "Meccan",
  },
  {
    number: 8,
    name: "الأنفال",
    englishName: "Al-Anfal",
    englishNameTranslation: "The Spoils of War",
    numberOfAyahs: 75,
    revelationType: "Medinan",
  },
  {
    number: 9,
    name: "التوبة",
    englishName: "At-Tawbah",
    englishNameTranslation: "The Repentance",
    numberOfAyahs: 129,
    revelationType: "Medinan",
  },
  {
    number: 10,
    name: "يونس",
    englishName: "Yunus",
    englishNameTranslation: "Jonah",
    numberOfAyahs: 109,
    revelationType: "Meccan",
  },
  // Adding the first 10 surahs for brevity, in a real app you would include all 114
];

const QuranReader = ({ onClose }: QuranReaderProps) => {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<
    { surah: number; ayah: number; timestamp: string }[]
  >([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSurahList, setShowSurahList] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [translation, setTranslation] = useState("en.asad");
  const [showArabic, setShowArabic] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState("");
  const [availableTranslations] = useState([
    { id: "en.asad", name: "Muhammad Asad" },
    { id: "en.pickthall", name: "Pickthall" },
    { id: "en.yusufali", name: "Yusuf Ali" },
    { id: "en.sahih", name: "Sahih International" },
  ]);

  useEffect(() => {
    // Load theme preference
    const themePreference = getThemePreference();
    setIsDarkMode(themePreference.isDarkMode);

    // Load bookmarks
    const savedBookmarks = getQuranBookmarks();
    setBookmarks(savedBookmarks);

    // Load last reading position if available
    const lastPosition = getQuranProgress();
    if (lastPosition) {
      setCurrentSurah(lastPosition.surah);
      setCurrentAyah(lastPosition.ayah);
      fetchSurah(lastPosition.surah, translation).then(() => {
        // Set ayah after surah data is loaded
        setCurrentAyah(lastPosition.ayah);
      });
    } else {
      // Load surah data
      fetchSurah(currentSurah, translation);
    }

    // Setup audio element
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };

    return () => {
      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Save reading progress when changing ayah or surah
  useEffect(() => {
    if (surahData) {
      saveQuranProgress(currentSurah, currentAyah);
    }
  }, [currentSurah, currentAyah, surahData]);

  // Update audio source when ayah changes
  useEffect(() => {
    if (surahData) {
      // Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3
      const formattedSurah = currentSurah.toString().padStart(3, "0");
      const formattedAyah = currentAyah.toString().padStart(3, "0");
      const newAudioSrc = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahData.number}${formattedAyah}.mp3`;
      setAudioSrc(newAudioSrc);

      if (audioRef.current) {
        audioRef.current.src = newAudioSrc;
        audioRef.current.load();
      }
    }
  }, [currentSurah, currentAyah, surahData]);

  const fetchSurah = async (
    surahNumber: number,
    translationId: string = "en.asad",
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${translationId}`,
      );
      const data = await response.json();
      if (data.code === 200) {
        setSurahData(data.data);
      }

      // Also fetch Arabic text if showing both
      if (showArabic) {
        const arabicResponse = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`,
        );
        const arabicData = await arabicResponse.json();
        if (arabicData.code === 200 && data.code === 200) {
          // Combine the data
          const combinedData = {
            ...data.data,
            ayahs: data.data.ayahs.map((ayah: any, index: number) => ({
              ...ayah,
              arabicText: arabicData.data.ayahs[index].text,
            })),
          };
          setSurahData(combinedData);
        }
      }
    } catch (error) {
      console.error("Error fetching Quran data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSurahChange = (surahNumber: number) => {
    if (surahNumber >= 1 && surahNumber <= 114) {
      setCurrentSurah(surahNumber);
      setCurrentAyah(1);
      fetchSurah(surahNumber, translation);
      setShowSurahList(false);
    }
  };

  const handleBookmark = () => {
    const existingBookmarkIndex = bookmarks.findIndex(
      (b) => b.surah === currentSurah && b.ayah === currentAyah,
    );

    if (existingBookmarkIndex >= 0) {
      // Remove bookmark
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks.splice(existingBookmarkIndex, 1);
      setBookmarks(updatedBookmarks);
      removeQuranBookmark(currentSurah, currentAyah);
    } else {
      // Add bookmark
      const newBookmark = {
        surah: currentSurah,
        ayah: currentAyah,
        timestamp: new Date().toISOString(),
      };
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      saveQuranBookmark(newBookmark);
    }
  };

  const isBookmarked = bookmarks.some(
    (b) => b.surah === currentSurah && b.ayah === currentAyah,
  );

  const handleSearch = () => {
    if (!searchQuery.trim() || !surahData) return;

    const results = surahData.ayahs.filter((ayah: any) =>
      ayah.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(results);
  };

  const goToAyah = (ayahNumber: number) => {
    if (surahData && ayahNumber >= 1 && ayahNumber <= surahData.numberOfAyahs) {
      setCurrentAyah(ayahNumber);
      setShowSearch(false);
      setShowBookmarks(false);
      setShowInfo(false);
      setShowSurahList(false);
    }
  };

  const goToBookmark = (surah: number, ayah: number) => {
    if (surah !== currentSurah) {
      setCurrentSurah(surah);
      fetchSurah(surah, translation).then(() => {
        setCurrentAyah(ayah);
      });
    } else {
      setCurrentAyah(ayah);
    }
    setShowBookmarks(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveThemePreference(newMode);
  };

  const handleTranslationChange = (newTranslation: string) => {
    setTranslation(newTranslation);
    fetchSurah(currentSurah, newTranslation);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const shareAyah = () => {
    if (!surahData || !surahData.ayahs[currentAyah - 1]) return;

    const ayahText = surahData.ayahs[currentAyah - 1].text;
    const shareText = `Surah ${surahData.englishName} (${currentAyah}): ${ayahText}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Quran - Surah ${surahData.englishName}`,
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          // Fallback to clipboard
          copyToClipboard(shareText);
        });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Ayah copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Get background and text colors based on theme
  const getThemeClasses = () => {
    return isDarkMode
      ? {
          bg: "bg-slate-900",
          text: "text-white",
          border: "border-slate-700",
          headerBg: "bg-slate-800",
          panelBg: "bg-slate-800",
          ayahBg: "bg-slate-800",
          buttonBg: "bg-slate-700",
          buttonHover: "hover:bg-slate-600",
          inputBg: "bg-slate-700",
          inputBorder: "border-slate-600",
          muted: "text-slate-400",
        }
      : {
          bg: "bg-white",
          text: "text-slate-900",
          border: "border-slate-200",
          headerBg: "bg-emerald-700",
          panelBg: "bg-slate-50",
          ayahBg: "bg-emerald-50",
          buttonBg: "bg-slate-100",
          buttonHover: "hover:bg-slate-200",
          inputBg: "bg-white",
          inputBorder: "border-slate-300",
          muted: "text-slate-500",
        };
  };

  const theme = getThemeClasses();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className={`${theme.bg} rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col ${theme.text}`}
      >
        <div
          className={`p-4 border-b ${theme.border} flex justify-between items-center ${theme.headerBg} text-white`}
        >
          <h2 className="text-lg font-semibold flex items-center">
            <Book className="h-5 w-5 mr-2" />
            Quran Reader
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              title="Bookmarks"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              title="Surah Info"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSurahList(!showSurahList)}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
              title="Surah List"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search panel */}
        {showSearch && (
          <div className={`p-4 border-b ${theme.border} ${theme.panelBg}`}>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in current surah..."
                className={`flex-1 p-2 border ${theme.inputBorder} rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="p-2 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div
                className={`max-h-40 overflow-y-auto border ${theme.border} rounded-md ${theme.bg}`}
              >
                {searchResults.map((result: any) => (
                  <button
                    key={result.number}
                    onClick={() => goToAyah(result.numberInSurah)}
                    className={`w-full text-left p-2 ${theme.buttonHover} border-b ${theme.border} last:border-b-0`}
                  >
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {result.numberInSurah}:
                    </span>{" "}
                    {result.text.substring(0, 100)}...
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks panel */}
        {showBookmarks && (
          <div className={`p-4 border-b ${theme.border} ${theme.panelBg}`}>
            <h3 className="font-medium mb-2">Your Bookmarks</h3>
            {bookmarks.length === 0 ? (
              <p className={`text-sm ${theme.muted}`}>
                No bookmarks yet. Add bookmarks as you read.
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto">
                {bookmarks.map((bookmark, index) => (
                  <button
                    key={index}
                    onClick={() => goToBookmark(bookmark.surah, bookmark.ayah)}
                    className={`w-full text-left p-2 ${theme.buttonHover} border ${theme.border} rounded-md mb-1 flex justify-between items-center`}
                  >
                    <span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        Surah {bookmark.surah}, Ayah {bookmark.ayah}
                      </span>
                    </span>
                    <span className={`text-xs ${theme.muted}`}>
                      {new Date(bookmark.timestamp).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className={`p-4 border-b ${theme.border} ${theme.panelBg}`}>
            <h3 className="font-medium mb-2">Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme.muted}`}>Font Size</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                    className={`p-1 ${theme.buttonBg} rounded-l-md ${theme.buttonHover}`}
                    disabled={fontSize <= 16}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span
                    className={`px-2 py-1 border-t border-b ${theme.border}`}
                  >
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    className={`p-1 ${theme.buttonBg} rounded-r-md ${theme.buttonHover}`}
                    disabled={fontSize >= 32}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <span className={`text-sm ${theme.muted}`}>Translation</span>
                <select
                  value={translation}
                  onChange={(e) => handleTranslationChange(e.target.value)}
                  className={`p-2 border ${theme.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
                >
                  {availableTranslations.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme.muted}`}>
                  Show Arabic Text
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showArabic}
                    onChange={() => {
                      setShowArabic(!showArabic);
                      fetchSurah(currentSurah, translation);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Surah Info panel */}
        {showInfo && surahData && (
          <div className={`p-4 border-b ${theme.border} ${theme.panelBg}`}>
            <h3 className="font-medium mb-2">Surah Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {surahData.name} (
                {surahData.englishName})
              </p>
              <p>
                <span className="font-medium">English Meaning:</span>{" "}
                {surahData.englishNameTranslation}
              </p>
              <p>
                <span className="font-medium">Number of Ayahs:</span>{" "}
                {surahData.numberOfAyahs}
              </p>
              <p>
                <span className="font-medium">Revelation Type:</span>{" "}
                {surahData.revelationType}
              </p>
            </div>
          </div>
        )}

        {/* Surah List panel */}
        {showSurahList && (
          <div className={`p-4 border-b ${theme.border} ${theme.panelBg}`}>
            <h3 className="font-medium mb-2">Surah List</h3>
            <div className="max-h-60 overflow-y-auto">
              {surahList.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => handleSurahChange(surah.number)}
                  className={`w-full text-left p-2 ${theme.buttonHover} border-b ${theme.border} last:border-b-0 flex justify-between items-center`}
                >
                  <div className="flex items-center">
                    <span className="w-8 text-center font-medium text-emerald-600 dark:text-emerald-400">
                      {surah.number}
                    </span>
                    <span className="ml-2">{surah.englishName}</span>
                  </div>
                  <span className="text-right font-arabic text-lg">
                    {surah.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Surah selector */}
        <div
          className={`p-4 border-b ${theme.border} ${theme.panelBg} flex justify-between items-center`}
        >
          <button
            onClick={() => handleSurahChange(currentSurah - 1)}
            disabled={currentSurah <= 1}
            className={`p-1 rounded-md ${theme.buttonHover} disabled:opacity-50`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            <select
              value={currentSurah}
              onChange={(e) => handleSurahChange(Number(e.target.value))}
              className={`p-2 border ${theme.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
            >
              {Array.from({ length: 114 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}.{" "}
                  {surahData && surahData.number === num
                    ? surahData.englishName
                    : surahList.find((s) => s.number === num)?.englishName ||
                      ""}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleSurahChange(currentSurah + 1)}
            disabled={currentSurah >= 114}
            className={`p-1 rounded-md ${theme.buttonHover} disabled:opacity-50`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Ayah display */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
          ) : surahData ? (
            <div>
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {surahData.englishName}
                </h2>
                <p className={`text-sm ${theme.muted}`}>
                  {surahData.englishNameTranslation}
                </p>
                <p className={`text-xs ${theme.muted} mt-1`}>
                  {surahData.numberOfAyahs} Ayahs
                </p>
              </div>

              <div
                className={`mb-4 p-4 ${theme.ayahBg} rounded-lg border ${theme.border} relative`}
              >
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={toggleAudio}
                    className={`p-1 rounded-full ${theme.muted} hover:text-emerald-600`}
                    title={isPlaying ? "Pause Recitation" : "Play Recitation"}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={shareAyah}
                    className={`p-1 rounded-full ${theme.muted} hover:text-emerald-600`}
                    title="Share Ayah"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-1 rounded-full ${isBookmarked ? "text-yellow-500" : `${theme.muted} hover:text-emerald-600`}`}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  >
                    <Bookmark
                      className="h-5 w-5"
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {surahData.ayahs[currentAyah - 1] && (
                  <div>
                    {showArabic &&
                      surahData.ayahs[currentAyah - 1].arabicText && (
                        <p className="text-right font-arabic mb-4 text-2xl leading-loose">
                          {surahData.ayahs[currentAyah - 1].arabicText}
                        </p>
                      )}
                    <p
                      className={theme.text}
                      style={{ fontSize: `${fontSize}px`, lineHeight: "1.7" }}
                    >
                      {surahData.ayahs[currentAyah - 1].text}
                    </p>
                    <div className={`mt-4 text-right text-sm ${theme.muted}`}>
                      Ayah {currentAyah} of {surahData.numberOfAyahs}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => goToAyah(currentAyah - 1)}
                  disabled={currentAyah <= 1}
                  className={`p-2 ${theme.buttonBg} rounded-md ${theme.buttonHover} disabled:opacity-50 flex items-center`}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </button>

                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max={surahData.numberOfAyahs}
                    value={currentAyah}
                    onChange={(e) => goToAyah(Number(e.target.value))}
                    className={`w-16 p-2 border ${theme.inputBorder} rounded-md text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
                  />
                  <span className={`mx-2 ${theme.muted}`}>/</span>
                  <span>{surahData.numberOfAyahs}</span>
                </div>

                <button
                  onClick={() => goToAyah(currentAyah + 1)}
                  disabled={currentAyah >= surahData.numberOfAyahs}
                  className={`p-2 ${theme.buttonBg} rounded-md ${theme.buttonHover} disabled:opacity-50 flex items-center`}
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              Failed to load Quran data
            </div>
          )}
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioSrc} preload="auto" />
      </div>
    </div>
  );
};

export default QuranReader;
