import { useState } from "react";
import { X, Check } from "lucide-react";
import { solidBackgrounds } from "../../lib/backgrounds";
import { saveDhikr, SavedDhikr } from "../../lib/storage";

interface DhikrFormProps {
  onClose: () => void;
  onSave: (dhikr: SavedDhikr) => void;
  editDhikr?: SavedDhikr;
}

const DhikrForm = ({ onClose, onSave, editDhikr }: DhikrFormProps) => {
  const [name, setName] = useState(editDhikr?.name || "");
  const [targetCount, setTargetCount] = useState(editDhikr?.targetCount || 33);
  const [selectedColor, setSelectedColor] = useState(
    editDhikr?.color || "#10b981",
  );

  const handleSave = () => {
    if (!name) {
      alert("Please enter a name for the dhikr");
      return;
    }

    const newDhikr: SavedDhikr = {
      id: editDhikr?.id || 0, // Will be assigned in storage.ts if new
      name,
      targetCount,
      color: selectedColor,
      lastUsed: editDhikr?.lastUsed || "Never",
      completedCount: editDhikr?.completedCount || 0,
    };

    const updatedDhikrs = saveDhikr(newDhikr);
    const savedDhikr = updatedDhikrs.find((d) => d.name === name) || newDhikr;
    onSave(savedDhikr);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {editDhikr ? "Edit Dhikr" : "Add New Dhikr"}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dhikr Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Subhanallah"
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Count
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setTargetCount((prev) => Math.max(1, prev - 1))}
                className="p-2 bg-slate-100 rounded-l-md border border-slate-300"
              >
                -
              </button>
              <input
                type="number"
                value={targetCount}
                onChange={(e) =>
                  setTargetCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="flex-1 p-3 border-t border-b border-slate-300 text-center"
              />
              <button
                onClick={() => setTargetCount((prev) => prev + 1)}
                className="p-2 bg-slate-100 rounded-r-md border border-slate-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {solidBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedColor(bg.color)}
                  className={`w-full h-10 rounded-md flex items-center justify-center ${selectedColor === bg.color ? "ring-2 ring-offset-2 ring-slate-500" : ""}`}
                  style={{ backgroundColor: bg.color }}
                >
                  {selectedColor === bg.color && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DhikrForm;
