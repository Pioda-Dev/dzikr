import { Save, RotateCcw, Palette, History, Zap, Target } from "lucide-react";

interface CounterControlsProps {
  onReset: () => void;
  isCompleted: boolean;
  targetCount: number;
  currentCount: number;
  onChangeBackground?: () => void;
  onChangeAnimation?: () => void;
  onChangeTarget?: () => void;
  onShowHistory?: () => void;
  onSave?: () => void;
}

const CounterControls = ({
  onReset,
  isCompleted = false,
  targetCount = 33,
  currentCount = 0,
  onChangeBackground,
  onChangeAnimation,
  onChangeTarget,
  onShowHistory,
  onSave,
}: CounterControlsProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-xs mt-4 bg-white rounded-lg shadow-sm p-4">
      <button
        onClick={onReset}
        className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
        aria-label="Reset counter"
      >
        <RotateCcw className="h-6 w-6" />
      </button>

      <div className="text-center">
        <span className="text-sm font-medium text-slate-500">
          {currentCount}/{targetCount === Infinity ? "∞" : targetCount}
        </span>
      </div>

      <button
        onClick={onSave}
        className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50"
        aria-label="Save dhikr"
      >
        <Save className="h-6 w-6" />
      </button>

      <button
        onClick={onChangeBackground}
        className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
        aria-label="Change background"
      >
        <Palette className="h-6 w-6" />
      </button>

      <button
        onClick={onChangeAnimation}
        className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
        aria-label="Change animation"
      >
        <Zap className="h-6 w-6" />
      </button>

      <button
        onClick={onChangeTarget}
        className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
        aria-label="Change target count"
      >
        <Target className="h-6 w-6" />
      </button>

      <button
        onClick={onShowHistory}
        className="p-2 rounded-full hover:bg-slate-100 text-slate-700"
        aria-label="View history"
      >
        <History className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CounterControls;
