import Header from "./layout/Header";
import TasbihCounter from "./tasbih/TasbihCounter";
import PrayerTimesCard from "./prayer/PrayerTimesCard";
import SavedDhikrList from "./tasbih/SavedDhikrList";
import BottomNavigation from "./layout/BottomNavigation";
import { useState, useEffect } from "react";
import { getSelectedBackground } from "../lib/storage";
import DhikrHistory from "./tasbih/DhikrHistory";
import InheritanceCalculator from "./inheritance/InheritanceCalculator";
import FinanceRecord from "./finance/FinanceRecord";
import QuranReader from "./quran/QuranReader";
import { Calculator, DollarSign, Book, X } from "lucide-react";

function Home() {
  const [activeTab, setActiveTab] = useState<
    "tasbih" | "prayer" | "saved" | "finance"
  >("tasbih");
  const [showHistory, setShowHistory] = useState(false);
  const [showInheritanceCalculator, setShowInheritanceCalculator] =
    useState(false);
  const [showFinanceRecord, setShowFinanceRecord] = useState(false);
  const [showQuranReader, setShowQuranReader] = useState(false);
  const [background, setBackground] = useState<any>(null);

  // Load background on mount
  useEffect(() => {
    const savedBackground = getSelectedBackground();
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);

  // Generate page background style
  const getPageBackgroundStyle = () => {
    if (!background) return {};

    if (background.type === "solid") {
      return { backgroundColor: "#f8fafc" }; // Light background for the page
    } else if (background.type === "gradient") {
      return { backgroundColor: "#f8fafc" }; // Light background for the page
    } else if (background.type === "pattern") {
      return {
        backgroundColor: background.baseColor,
        backgroundImage: background.pattern,
        backgroundAttachment: "fixed",
      };
    }

    return {};
  };

  return (
    <div
      className="flex flex-col w-full h-screen"
      style={getPageBackgroundStyle()}
    >
      <Header />

      <main className="flex-1 overflow-auto p-4 pb-20">
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={() => setShowQuranReader(true)}
            className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
          >
            <Book className="h-4 w-4 mr-1" />
            Quran Reader
          </button>

          <button
            onClick={() => setShowInheritanceCalculator(true)}
            className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
          >
            <Calculator className="h-4 w-4 mr-1" />
            Inheritance Calculator
          </button>

          <button
            onClick={() => setShowFinanceRecord(true)}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Financial Record
          </button>
        </div>

        {activeTab === "tasbih" && (
          <div className="flex flex-col items-center">
            <TasbihCounter onShowHistory={() => setShowHistory(true)} />
          </div>
        )}

        {activeTab === "prayer" && (
          <div className="flex flex-col items-center">
            <PrayerTimesCard />
          </div>
        )}

        {activeTab === "saved" && (
          <div className="flex flex-col items-center">
            <SavedDhikrList />
          </div>
        )}

        {activeTab === "finance" && (
          <div className="flex flex-col items-center">
            <FinanceRecord />
          </div>
        )}
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* History modal */}
      {showHistory && <DhikrHistory onClose={() => setShowHistory(false)} />}

      {/* Inheritance Calculator modal */}
      {showInheritanceCalculator && (
        <InheritanceCalculator
          onClose={() => setShowInheritanceCalculator(false)}
        />
      )}

      {/* Finance Record modal */}
      {showFinanceRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">
                Financial Record
              </h2>
              <button
                onClick={() => setShowFinanceRecord(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4">
              <FinanceRecord />
            </div>
          </div>
        </div>
      )}

      {/* Quran Reader modal */}
      {showQuranReader && (
        <QuranReader onClose={() => setShowQuranReader(false)} />
      )}
    </div>
  );
}

export default Home;
