import { useState } from "react";
import { X, Calculator } from "lucide-react";
import { CALCULATION_METHODS, CalculationMethod } from "../../lib/prayerTimes";
import { saveCalculationMethod, getCalculationMethod } from "../../lib/storage";

interface CalculationMethodSelectorProps {
  onClose: () => void;
  onSelect: (methodId: number) => void;
}

const CalculationMethodSelector = ({
  onClose,
  onSelect,
}: CalculationMethodSelectorProps) => {
  const savedMethodId = getCalculationMethod();
  const [selectedMethodId, setSelectedMethodId] = useState<number>(
    savedMethodId || 3,
  );

  const handleSelect = () => {
    saveCalculationMethod(selectedMethodId);
    onSelect(selectedMethodId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Prayer Calculation Method
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">
            Select the calculation method for prayer times based on your
            location or preference.
          </p>

          <div className="max-h-72 overflow-y-auto mb-4">
            {CALCULATION_METHODS.map((method) => (
              <div
                key={method.id}
                className={`p-3 mb-2 rounded-md cursor-pointer ${selectedMethodId === method.id ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 hover:bg-slate-100"}`}
                onClick={() => setSelectedMethodId(method.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`w-4 h-4 mt-1 mr-3 rounded-full ${selectedMethodId === method.id ? "bg-emerald-500" : "border border-slate-300"}`}
                  ></div>
                  <div>
                    <h3 className="font-medium text-slate-800">
                      {method.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSelect}
            className="w-full py-3 flex items-center justify-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Apply Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculationMethodSelector;
