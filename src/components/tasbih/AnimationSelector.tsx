import { useState } from "react";
import { X, Check } from "lucide-react";

type AnimationType = "none" | "pulse" | "bounce" | "spin" | "fade";

interface AnimationSelectorProps {
  onClose: () => void;
  onSelect: (animation: AnimationType) => void;
  currentAnimation: AnimationType;
}

const AnimationSelector = ({
  onClose,
  onSelect,
  currentAnimation,
}: AnimationSelectorProps) => {
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationType>(currentAnimation);

  const animations: { id: AnimationType; name: string; icon: string }[] = [
    { id: "none", name: "None", icon: "⚪" },
    { id: "pulse", name: "Pulse", icon: "💓" },
    { id: "bounce", name: "Bounce", icon: "🏀" },
    { id: "spin", name: "Spin", icon: "🔄" },
    { id: "fade", name: "Fade", icon: "🌓" },
  ];

  const handleSelect = () => {
    onSelect(selectedAnimation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold">Select Animation</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {animations.map((animation) => (
              <div
                key={animation.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedAnimation === animation.id ? "bg-emerald-100 border-2 border-emerald-500" : "bg-slate-50 hover:bg-slate-100 border border-slate-200"}`}
                onClick={() => setSelectedAnimation(animation.id)}
              >
                <div className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center text-2xl
                      ${animation.id === "pulse" ? "animate-pulse" : ""}
                      ${animation.id === "bounce" ? "animate-bounce" : ""}
                      ${animation.id === "spin" ? "animate-spin" : ""}
                      ${animation.id === "fade" ? "opacity-50" : ""}
                    `}
                  >
                    {animation.icon}
                  </div>
                  <span className="font-medium text-slate-700">
                    {animation.name}
                  </span>
                  {selectedAnimation === animation.id && (
                    <div className="mt-2 flex justify-center">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

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
              Apply Animation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationSelector;
