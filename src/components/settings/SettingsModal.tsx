import { useState } from "react";
import { X, Settings, Globe, DollarSign } from "lucide-react";
import { t } from "../../lib/i18n";
import LanguageSelector from "./LanguageSelector";
import CurrencySelector from "./CurrencySelector";

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<"language" | "currency">(
    "language",
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            {t("settings.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("language")}
            className={`flex-1 py-3 flex items-center justify-center text-sm font-medium ${activeTab === "language" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-600 hover:text-slate-800"}`}
          >
            <Globe className="h-4 w-4 mr-2" />
            {t("settings.language")}
          </button>
          <button
            onClick={() => setActiveTab("currency")}
            className={`flex-1 py-3 flex items-center justify-center text-sm font-medium ${activeTab === "currency" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-600 hover:text-slate-800"}`}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {t("settings.currency")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "language" ? (
            <LanguageSelector />
          ) : (
            <CurrencySelector />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
