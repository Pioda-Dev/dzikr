import { useState } from "react";
import { DollarSign } from "lucide-react";
import { t } from "../../lib/i18n";

interface CurrencySelectorProps {
  onClose?: () => void;
}

const CurrencySelector = ({ onClose }: CurrencySelectorProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    localStorage.getItem("currency") || "IDR",
  );

  const currencies = [
    { code: "IDR", name: "Indonesian Rupiah (Rp)" },
    { code: "USD", name: "US Dollar ($)" },
  ];

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    localStorage.setItem("currency", currencyCode);
    // Force refresh to apply currency changes
    window.location.reload();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
          {t("settings.currency")}
        </h2>
      </div>

      <div className="space-y-2">
        {currencies.map((currency) => (
          <div
            key={currency.code}
            className={`p-3 rounded-md cursor-pointer flex items-center ${selectedCurrency === currency.code ? "bg-emerald-100 border border-emerald-300" : "bg-slate-50 hover:bg-slate-100 border border-slate-200"}`}
            onClick={() => handleCurrencyChange(currency.code)}
          >
            <div className="flex-1">
              <p className="font-medium">{currency.name}</p>
            </div>
            {selectedCurrency === currency.code && (
              <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;
