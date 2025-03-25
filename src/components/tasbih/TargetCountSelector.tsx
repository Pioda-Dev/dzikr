import { useState } from "react";
import { X, Check, Infinity as InfinityIcon } from "lucide-react";

interface TargetCountSelectorProps {
  onClose: () => void;
  onSelect: (targetCount: number) => void;
  currentTargetCount: number;
}

const TargetCountSelector = ({
  onClose,
  onSelect,
  currentTargetCount,
}: TargetCountSelectorProps) => {
  const [isUnlimited, setIsUnlimited] = useState(
    currentTargetCount === Infinity,
  );
  const [targetCount, setTargetCount] = useState<number>(
    currentTargetCount === Infinity ? 33 : currentTargetCount,
  );

  const handleSelect = () => {
    onSelect(isUnlimited ? Infinity : targetCount);
    onClose();
  };

  const presetCounts = [33, 99, 100, 500, 1000];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold">Set Target Count</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div
              className={`p-4 rounded-lg cursor-pointer transition-all ${isUnlimited ? "bg-emerald-100 border-2 border-emerald-500" : "bg-slate-50 hover:bg-slate-100 border border-slate-200"}`}
              onClick={() => setIsUnlimited(true)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                  <span className="text-2xl">∞</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800">Unlimited Mode</h3>
                  <p className="text-xs text-slate-500">
                    Count without a target limit
                  </p>
                </div>
                {isUnlimited && <Check className="h-5 w-5 text-emerald-600" />}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div
              className={`p-4 rounded-lg cursor-pointer transition-all ${!isUnlimited ? "bg-emerald-100 border-2 border-emerald-500" : "bg-slate-50 hover:bg-slate-100 border border-slate-200"}`}
              onClick={() => setIsUnlimited(false)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                  <span className="text-lg font-medium">{targetCount}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800">Target Count</h3>
                  <p className="text-xs text-slate-500">
                    Set a specific target to reach
                  </p>
                </div>
                {!isUnlimited && <Check className="h-5 w-5 text-emerald-600" />}
              </div>
            </div>
          </div>

          {!isUnlimited && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Target Count
              </label>
              <input
                type="number"
                min="1"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
              />

              <div className="flex flex-wrap gap-2">
                {presetCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setTargetCount(count)}
                    className={`px-3 py-1.5 rounded-md text-sm ${targetCount === count ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              {isUnlimited ? "Set to Unlimited" : `Set to ${targetCount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetCountSelector;
