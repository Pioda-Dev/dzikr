import { useState } from "react";
import { X, Calendar, Download, PieChart, BarChart } from "lucide-react";
import { t } from "../../lib/i18n";
import { formatCurrency } from "../../lib/wallet";
import {
  getFinanceRecordsByDateRange,
  getExpenseBreakdown,
  getTotalIncome,
  getTotalExpense,
  getBalance,
  exportFinanceRecords,
} from "../../lib/finance";

interface FinanceReportModalProps {
  onClose: () => void;
}

const FinanceReportModal = ({ onClose }: FinanceReportModalProps) => {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date;
  });

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);

  // Get data for the selected date range
  const totalIncome = getTotalIncome(startDate, endDate);
  const totalExpense = getTotalExpense(startDate, endDate);
  const balance = getBalance(startDate, endDate);
  const expenseBreakdown = getExpenseBreakdown(startDate, endDate);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportFinanceRecords();
      alert("Finance records exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export finance records");
    } finally {
      setIsExporting(false);
    }
  };

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(expenseBreakdown).sort(
    ([, amountA], [, amountB]) => amountB - amountA,
  );

  // Calculate percentages for pie chart
  const totalExpenseAmount = Object.values(expenseBreakdown).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {t("finance.report")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Date range selector */}
        <div className="p-4 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("finance.startDate")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("finance.endDate")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t("finance.summary")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-emerald-50 rounded-md">
              <p className="text-xs text-slate-500">{t("finance.income")}</p>
              <p className="text-sm font-medium text-emerald-600">
                {formatCurrency(totalIncome, "IDR")}
              </p>
            </div>
            <div className="p-2 bg-red-50 rounded-md">
              <p className="text-xs text-slate-500">{t("finance.expense")}</p>
              <p className="text-sm font-medium text-red-600">
                {formatCurrency(totalExpense, "IDR")}
              </p>
            </div>
            <div className="p-2 bg-slate-50 rounded-md">
              <p className="text-xs text-slate-500">{t("finance.balance")}</p>
              <p
                className={`text-sm font-medium ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {formatCurrency(balance, "IDR")}
              </p>
            </div>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t("finance.expenseBreakdown")}
            </h3>
            <div className="flex items-center text-xs text-slate-500">
              <PieChart className="h-3 w-3 mr-1" />
              <span>{t("finance.byCategory")}</span>
            </div>
          </div>

          {sortedCategories.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              <p>{t("finance.noExpenses")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedCategories.map(([category, amount]) => {
                const percentage =
                  totalExpenseAmount > 0
                    ? (amount / totalExpenseAmount) * 100
                    : 0;

                return (
                  <div
                    key={category}
                    className="bg-white rounded-md border border-slate-200 p-2"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {category}
                      </span>
                      <span className="text-sm text-slate-600">
                        {formatCurrency(amount, "IDR")}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-slate-500 mt-1">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Export button */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center justify-center"
          >
            {isExporting ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t("finance.exportRecords")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceReportModal;
