import { useState } from "react";
import { X, Type, ZoomIn, ZoomOut } from "lucide-react";
import { saveClockSettings, getClockSettings } from "../../lib/storage";

interface ClockSettingsProps {
  onClose: () => void;
  onApply: (settings: ClockSettings) => void;
}

export interface ClockSettings {
  fontSize: number;
  fontFamily: string;
}

const FONT_OPTIONS = [
  { name: "Default", value: "inherit" },
  { name: "Digital", value: "'Digital-7', monospace" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Poppins", value: "'Poppins', sans-serif" },
  { name: "Lato", value: "'Lato', sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
];

const ClockSettings = ({ onClose, onApply }: ClockSettingsProps) => {
  const savedSettings = getClockSettings();
  const [fontSize, setFontSize] = useState(savedSettings?.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(
    savedSettings?.fontFamily || "inherit",
  );

  const handleApply = () => {
    const settings: ClockSettings = { fontSize, fontFamily };
    saveClockSettings(settings);
    onApply(settings);
    onClose();
  };

  const increaseFontSize = () => {
    if (fontSize < 48) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 16) {
      setFontSize(fontSize - 2);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Clock Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Font Size
            </label>
            <div className="flex items-center">
              <button
                onClick={decreaseFontSize}
                className="p-2 bg-slate-100 rounded-l-md hover:bg-slate-200"
                disabled={fontSize <= 16}
              >
                <ZoomOut className="h-4 w-4 text-slate-700" />
              </button>
              <div className="px-4 py-2 border-t border-b border-slate-300 flex-1 text-center">
                {fontSize}px
              </div>
              <button
                onClick={increaseFontSize}
                className="p-2 bg-slate-100 rounded-r-md hover:bg-slate-200"
                disabled={fontSize >= 48}
              >
                <ZoomIn className="h-4 w-4 text-slate-700" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Font Family
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Type className="h-4 w-4 text-slate-500" />
              </div>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 p-3 border border-slate-200 rounded-md">
            <p className="text-sm text-slate-600 mb-2">Preview:</p>
            <div
              className="text-center p-2"
              style={{ fontFamily, fontSize: `${fontSize}px` }}
            >
              12:34 PM
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClockSettings;
