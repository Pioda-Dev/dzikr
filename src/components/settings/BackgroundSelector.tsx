import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllBackgrounds, BackgroundOption } from "../../lib/backgrounds";
import {
  saveSelectedBackground,
  getSelectedBackground,
} from "../../lib/storage";

interface BackgroundSelectorProps {
  onClose: () => void;
  onSelect: (background: BackgroundOption) => void;
}

const BackgroundSelector = ({ onClose, onSelect }: BackgroundSelectorProps) => {
  const [backgrounds, setBackgrounds] = useState<BackgroundOption[]>([]);
  const [selectedType, setSelectedType] = useState<
    "solid" | "gradient" | "pattern"
  >("solid");

  useEffect(() => {
    const allBackgrounds = getAllBackgrounds();
    setBackgrounds(allBackgrounds);

    // Load previously selected background
    const savedBackground = getSelectedBackground();
    if (savedBackground) {
      setSelectedType(savedBackground.type);
    }
  }, []);

  const handleSelectBackground = (background: BackgroundOption) => {
    saveSelectedBackground(background);
    onSelect(background);
  };

  const filteredBackgrounds = backgrounds.filter(
    (bg) => bg.type === selectedType,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Select Background
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedType("solid")}
              className={`px-4 py-2 rounded-md ${selectedType === "solid" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
            >
              Solid
            </button>
            <button
              onClick={() => setSelectedType("gradient")}
              className={`px-4 py-2 rounded-md ${selectedType === "gradient" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
            >
              Gradient
            </button>
            <button
              onClick={() => setSelectedType("pattern")}
              className={`px-4 py-2 rounded-md ${selectedType === "pattern" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
            >
              Pattern
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredBackgrounds.map((bg) => {
              let style: React.CSSProperties = {};

              if (bg.type === "solid") {
                style = { backgroundColor: bg.color };
              } else if (bg.type === "gradient") {
                style = { background: bg.gradient };
              } else if (bg.type === "pattern") {
                style = {
                  backgroundColor: bg.baseColor,
                  backgroundImage: bg.pattern,
                };
              }

              return (
                <button
                  key={bg.id}
                  onClick={() => handleSelectBackground(bg)}
                  className="rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 transition-colors"
                >
                  <div className="h-24 w-full" style={style}></div>
                  <div className="p-2 text-center text-sm font-medium text-slate-700 bg-white">
                    {bg.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
