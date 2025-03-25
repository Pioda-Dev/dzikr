import { useState, useEffect } from "react";
import CounterControls from "./CounterControls";
import BackgroundSelector from "../settings/BackgroundSelector";
import AnimationSelector from "./AnimationSelector";
import TargetCountSelector from "./TargetCountSelector";
import DhikrHistory from "./DhikrHistory";
import { BackgroundOption, getAllBackgrounds } from "../../lib/backgrounds";
import {
  getSelectedBackground,
  saveSelectedBackground,
  addDhikrToHistory,
  getSavedDhikr,
} from "../../lib/storage";

interface TasbihCounterProps {
  initialCount?: number;
  targetCount?: number;
  backgroundColor?: string;
  dhikrId?: number;
  dhikrName?: string;
  onSave?: (count: number) => void;
  onShowHistory?: () => void;
  animationType?: "none" | "pulse" | "bounce" | "spin" | "fade";
}

const TasbihCounter = ({
  initialCount = 0,
  targetCount = Infinity,
  backgroundColor = "#10b981",
  dhikrId,
  dhikrName = "Dhikr",
  onSave,
  onShowHistory,
  animationType = "none",
}: TasbihCounterProps) => {
  const [count, setCount] = useState(initialCount);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showAnimationSelector, setShowAnimationSelector] = useState(false);
  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [background, setBackground] = useState<BackgroundOption | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<
    "none" | "pulse" | "bounce" | "spin" | "fade"
  >(animationType);
  const [currentTargetCount, setCurrentTargetCount] =
    useState<number>(targetCount);

  // Load saved background on mount
  useEffect(() => {
    const savedBackground = getSelectedBackground();
    if (savedBackground) {
      setBackground(savedBackground);
    } else {
      // Set default background if none is saved
      const defaultBackground: BackgroundOption = {
        type: "solid",
        id: "emerald",
        name: "Emerald",
        color: backgroundColor,
      };
      setBackground(defaultBackground);
      saveSelectedBackground(defaultBackground);
    }
  }, [backgroundColor]);

  // Calculate progress percentage
  const progress =
    currentTargetCount === Infinity ? 100 : (count / currentTargetCount) * 100;

  // Handle count increment
  const incrementCount = () => {
    // Allow incrementing even if target is reached
    setCount((prev) => prev + 1);

    // Vibrate on certain milestones or when completed
    if (
      (currentTargetCount !== Infinity && count + 1 === currentTargetCount) ||
      (count + 1) % 10 === 0
    ) {
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  };

  // Handle count decrement
  const decrementCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
    }
  };

  // Check if count is completed
  useEffect(() => {
    if (currentTargetCount !== Infinity && count >= currentTargetCount) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [count, currentTargetCount]);

  // Reset counter
  const resetCounter = () => {
    setCount(0);
    setIsCompleted(false);
  };

  // Handle background selection
  const handleSelectBackground = (selectedBg: BackgroundOption) => {
    setBackground(selectedBg);
    saveSelectedBackground(selectedBg);
    setShowBackgroundSelector(false);
  };

  // Generate background style based on selected background
  const getBackgroundStyle = () => {
    if (!background) {
      return {
        background: `conic-gradient(${backgroundColor} ${progress}%, #e2e8f0 ${progress}%)`,
      };
    }

    if (background.type === "solid") {
      return {
        background: `conic-gradient(${background.color} ${progress}%, #e2e8f0 ${progress}%)`,
      };
    } else if (background.type === "gradient") {
      // For gradients, we'll use a more complex approach with a pseudo-element in a real app
      // This is a simplified version
      return {
        backgroundImage: background.gradient,
        // Add a radial mask to show progress
        mask: `conic-gradient(black ${progress}%, transparent ${progress}%)`,
        WebkitMask: `conic-gradient(black ${progress}%, transparent ${progress}%)`,
      };
    } else if (background.type === "pattern") {
      return {
        backgroundColor: background.baseColor,
        backgroundImage: background.pattern,
        // Add a radial mask to show progress
        mask: `conic-gradient(black ${progress}%, transparent ${progress}%)`,
        WebkitMask: `conic-gradient(black ${progress}%, transparent ${progress}%)`,
      };
    }

    return {};
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(count);
    } else {
      // Always save to history, even if dhikrId is not provided
      // Create a temporary dhikr object if dhikrId is not provided
      const dhikrToSave = {
        id: dhikrId || Date.now(), // Use timestamp as ID if no dhikrId
        name: dhikrName,
        targetCount:
          currentTargetCount === Infinity ? count : currentTargetCount,
        color: backgroundColor,
        lastUsed: "Today",
        completedCount: 0,
      };

      // Add to history
      addDhikrToHistory(dhikrToSave, count);

      // Show confirmation
      alert("Dhikr saved to history!");
      resetCounter();
    }
  };

  // Handle show history
  const handleShowHistory = () => {
    if (onShowHistory) {
      onShowHistory();
    } else {
      setShowHistory(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Dhikr name display */}
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">
        {dhikrName}
      </h2>

      {/* Circular progress indicator */}
      <div
        className={`relative w-64 h-64 rounded-full flex items-center justify-center cursor-pointer mb-6 ${currentAnimation === "pulse" ? "animate-pulse" : ""} ${currentAnimation === "bounce" ? "animate-bounce" : ""} ${currentAnimation === "spin" ? "animate-spin" : ""} ${currentAnimation === "fade" ? "animate-fade" : ""}`}
        onClick={incrementCount}
        style={getBackgroundStyle()}
      >
        {/* Inner circle with count */}
        <div className="absolute w-52 h-52 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center">
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementCount();
              }}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mr-4 bg-slate-100 dark:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Decrease count"
            >
              -
            </button>
            <span className="text-5xl font-bold text-slate-800 dark:text-slate-200">
              {count}
            </span>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {currentTargetCount === Infinity ? "∞" : `of ${currentTargetCount}`}
          </span>

          {isCompleted && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 rounded-full">
              <div className="text-center">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                  Completed!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <CounterControls
        onReset={resetCounter}
        isCompleted={isCompleted}
        targetCount={currentTargetCount}
        currentCount={count}
        onChangeBackground={() => setShowBackgroundSelector(true)}
        onChangeAnimation={() => setShowAnimationSelector(true)}
        onChangeTarget={() => setShowTargetSelector(true)}
        onShowHistory={handleShowHistory}
        onSave={handleSave}
      />

      {/* Background selector modal */}
      {showBackgroundSelector && (
        <BackgroundSelector
          onClose={() => setShowBackgroundSelector(false)}
          onSelect={handleSelectBackground}
        />
      )}

      {/* Animation selector modal */}
      {showAnimationSelector && (
        <AnimationSelector
          onClose={() => setShowAnimationSelector(false)}
          onSelect={(animation) => setCurrentAnimation(animation)}
          currentAnimation={currentAnimation}
        />
      )}

      {/* Target count selector modal */}
      {showTargetSelector && (
        <TargetCountSelector
          onClose={() => setShowTargetSelector(false)}
          onSelect={(target) => setCurrentTargetCount(target)}
          currentTargetCount={currentTargetCount}
        />
      )}

      {/* History modal */}
      {showHistory && (
        <DhikrHistory
          onClose={() => setShowHistory(false)}
          onClearHistory={() => {
            // Refresh the counter after clearing history
            setShowHistory(false);
          }}
        />
      )}
    </div>
  );
};

export default TasbihCounter;
