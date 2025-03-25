import { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Trash2,
  ArrowLeft,
  ArrowRight,
  X,
  BarChart,
  Settings,
} from "lucide-react";
import { t, getCurrentLanguage } from "../../lib/i18n";
import { formatCurrency } from "../../lib/wallet";
import {
  getFinanceRecords,
  addFinanceRecord,
  deleteFinanceRecord,
  FinanceRecord as FinanceRecordType,
} from "../../lib/finance";
import AddFinanceRecordModal from "./AddFinanceRecordModal";
import FinanceReportModal from "./FinanceReportModal";
import SettingsModal from "../settings/SettingsModal";

const FinanceRecord = () => {
  const currentLang = getCurrentLanguage();
  const [records, setRecords] = useState<FinanceRecordType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem("currency") || "IDR",
  );

  useEffect(() => {
    loadRecords();
    // Listen for currency changes
    const handleStorageChange = () => {
      setCurrency(localStorage.getItem("currency") || "IDR");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [selectedDate, filterType]);

  const loadRecords = () => {
    const allRecords = getFinanceRecords();

    // Filter by date (same day)
    const filteredByDate = allRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === selectedDate.toDateString();
    });

    // Filter by type if needed
    const filtered =
      filterType === "all"
        ? filteredByDate
        : filteredByDate.filter((record) => record.type === filterType);

    setRecords(filtered);
  };

  const handleAddRecord = (record: FinanceRecordType) => {
    addFinanceRecord(record);
    loadRecords();
    setShowAddModal(false);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm(t("finance.confirmDelete"))) {
      deleteFinanceRecord(id);
      loadRecords();
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Calculate totals
  const totalIncome = records
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpense = records
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-emerald-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{t("finance.title")}</h2>
            <p className="text-sm text-emerald-100 mt-1">
              {t("finance.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full hover:bg-emerald-600 transition-colors"
            title={t("settings.title")}
          >
            <Settings className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div className="flex items-center justify-between p-3 bg-emerald-50 border-b border-emerald-100">
        <button
          onClick={() => changeDate(-1)}
          className="p-1 rounded-full hover:bg-emerald-100"
        >
          <ArrowLeft className="h-5 w-5 text-emerald-700" />
        </button>

        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-emerald-700 mr-2" />
          <span className="text-sm font-medium text-emerald-800">
            {selectedDate.toLocaleDateString(
              currentLang === "id" ? "id-ID" : undefined,
              {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            )}
          </span>
        </div>

        <button
          onClick={() => changeDate(1)}
          className="p-1 rounded-full hover:bg-emerald-100"
        >
          <ArrowRight className="h-5 w-5 text-emerald-700" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setFilterType("all")}
          className={`flex-1 py-2 text-sm font-medium ${filterType === "all" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-600 hover:text-slate-800"}`}
        >
          {t("finance.all")}
        </button>
        <button
          onClick={() => setFilterType("income")}
          className={`flex-1 py-2 text-sm font-medium ${filterType === "income" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-600 hover:text-slate-800"}`}
        >
          {t("finance.income")}
        </button>
        <button
          onClick={() => setFilterType("expense")}
          className={`flex-1 py-2 text-sm font-medium ${filterType === "expense" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-600 hover:text-slate-800"}`}
        >
          {t("finance.expense")}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50">
        <div className="p-2 bg-white rounded-md border border-slate-200">
          <p className="text-xs text-slate-500">{t("finance.income")}</p>
          <p className="text-sm font-medium text-emerald-600">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>
        <div className="p-2 bg-white rounded-md border border-slate-200">
          <p className="text-xs text-slate-500">{t("finance.expense")}</p>
          <p className="text-sm font-medium text-red-600">
            {formatCurrency(totalExpense, currency)}
          </p>
        </div>
        <div className="p-2 bg-white rounded-md border border-slate-200">
          <p className="text-xs text-slate-500">{t("finance.balance")}</p>
          <p
            className={`text-sm font-medium ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {formatCurrency(balance, currency)}
          </p>
        </div>
      </div>

      {/* Records list */}
      <div className="max-h-80 overflow-y-auto">
        {records.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p>{t("finance.noRecords")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((record) => (
              <div key={record.id} className="p-3 hover:bg-slate-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-full mr-3 ${record.type === "income" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      {record.type === "income" ? (
                        <ArrowDown className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {record.description}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {record.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p
                      className={`text-sm font-medium ${record.type === "income" ? "text-emerald-600" : "text-red-600"} mr-2`}
                    >
                      {record.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(record.amount, currency)}
                    </p>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-slate-200 grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("finance.addRecord")}
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <BarChart className="h-4 w-4 mr-2" />
          {t("finance.report")}
        </button>
      </div>

      {/* Add record modal */}
      {showAddModal && (
        <AddFinanceRecordModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddRecord}
          initialDate={selectedDate}
        />
      )}

      {/* Report modal */}
      {showReportModal && (
        <FinanceReportModal onClose={() => setShowReportModal(false)} />
      )}

      {/* Settings modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};

export default FinanceRecord;
