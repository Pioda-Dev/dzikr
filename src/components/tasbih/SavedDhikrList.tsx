import { useState, useEffect } from "react";
import { Plus, ChevronRight, Trash2 } from "lucide-react";
import { getSavedDhikr, SavedDhikr, deleteDhikr } from "../../lib/storage";
import DhikrForm from "./DhikrForm";
import TasbihCounter from "./TasbihCounter";
import DhikrHistory from "./DhikrHistory";

const SavedDhikrList = () => {
  const [savedDhikrs, setSavedDhikrs] = useState<SavedDhikr[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editDhikr, setEditDhikr] = useState<SavedDhikr | null>(null);
  const [selectedDhikr, setSelectedDhikr] = useState<SavedDhikr | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load saved dhikr on mount
  useEffect(() => {
    const dhikrs = getSavedDhikr();
    setSavedDhikrs(dhikrs);
  }, []);

  // Handle adding new dhikr
  const handleAddDhikr = (dhikr: SavedDhikr) => {
    setSavedDhikrs(getSavedDhikr());
    setShowAddForm(false);
  };

  // Handle editing dhikr
  const handleEditDhikr = (dhikr: SavedDhikr) => {
    setEditDhikr(dhikr);
    setShowAddForm(true);
  };

  // Handle deleting dhikr
  const handleDeleteDhikr = (id: number) => {
    if (window.confirm("Are you sure you want to delete this dhikr?")) {
      const updatedDhikrs = deleteDhikr(id);
      setSavedDhikrs(updatedDhikrs);
    }
  };

  // Handle selecting dhikr for counter
  const handleSelectDhikr = (dhikr: SavedDhikr) => {
    setSelectedDhikr(dhikr);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedDhikr(null);
    // Refresh the list
    setSavedDhikrs(getSavedDhikr());
  };

  // If a dhikr is selected, show the counter
  if (selectedDhikr) {
    return (
      <div className="w-full max-w-md">
        <button
          onClick={handleBackToList}
          className="mb-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center"
        >
          <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
          Back to list
        </button>

        <TasbihCounter
          targetCount={selectedDhikr.targetCount}
          backgroundColor={selectedDhikr.color}
          dhikrId={selectedDhikr.id}
          dhikrName={selectedDhikr.name}
          onSave={() => {
            // This would update the completion count in a real app
            handleBackToList();
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-700 text-white p-4">
        <h2 className="text-xl font-semibold">Saved Dhikr</h2>
        <p className="text-sm text-emerald-100 mt-1">
          Your personal collection
        </p>
      </div>

      {/* Dhikr list */}
      <div className="divide-y divide-slate-100">
        {savedDhikrs.map((dhikr) => (
          <div
            key={dhikr.id}
            className="flex items-center justify-between p-4 hover:bg-slate-50"
          >
            <div
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => handleSelectDhikr(dhikr)}
            >
              <div
                className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: dhikr.color }}
              >
                {dhikr.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{dhikr.name}</h3>
                <p className="text-xs text-slate-500">
                  Target: {dhikr.targetCount} • Completed:{" "}
                  {dhikr.completedCount} times
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleEditDhikr(dhikr)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteDhikr(dhikr.id)}
                className="p-2 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-slate-100 flex space-x-2">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex-1 py-3 flex items-center justify-center text-emerald-600 font-medium rounded-md border border-emerald-200 hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Dhikr
        </button>

        <button
          onClick={() => setShowHistory(true)}
          className="flex-1 py-3 flex items-center justify-center text-slate-600 font-medium rounded-md border border-slate-200 hover:bg-slate-50"
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          View History
        </button>
      </div>

      {/* Add/Edit dhikr form */}
      {showAddForm && (
        <DhikrForm
          onClose={() => {
            setShowAddForm(false);
            setEditDhikr(null);
          }}
          onSave={handleAddDhikr}
          editDhikr={editDhikr || undefined}
        />
      )}

      {/* History modal */}
      {showHistory && (
        <DhikrHistory
          onClose={() => setShowHistory(false)}
          onClearHistory={() => {
            // Refresh the list after clearing history
            setSavedDhikrs(getSavedDhikr());
          }}
        />
      )}
    </div>
  );
};

export default SavedDhikrList;
