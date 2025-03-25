import { Home, Clock, BookMarked, DollarSign } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "tasbih" | "prayer" | "saved" | "finance";
  setActiveTab: (tab: "tasbih" | "prayer" | "saved" | "finance") => void;
}

const BottomNavigation = ({
  activeTab,
  setActiveTab,
}: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] h-16 flex justify-around items-center">
      <button
        onClick={() => setActiveTab("tasbih")}
        className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === "tasbih" ? "text-emerald-600" : "text-slate-500"}`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Tasbih</span>
      </button>

      <button
        onClick={() => setActiveTab("prayer")}
        className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === "prayer" ? "text-emerald-600" : "text-slate-500"}`}
      >
        <Clock className="h-6 w-6" />
        <span className="text-xs mt-1">Prayer</span>
      </button>

      <button
        onClick={() => setActiveTab("saved")}
        className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === "saved" ? "text-emerald-600" : "text-slate-500"}`}
      >
        <BookMarked className="h-6 w-6" />
        <span className="text-xs mt-1">Saved</span>
      </button>

      <button
        onClick={() => setActiveTab("finance")}
        className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === "finance" ? "text-emerald-600" : "text-slate-500"}`}
      >
        <DollarSign className="h-6 w-6" />
        <span className="text-xs mt-1">Finance</span>
      </button>
    </nav>
  );
};

export default BottomNavigation;
