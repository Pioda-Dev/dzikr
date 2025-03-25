import { useState } from "react";
import { X, Calendar, DollarSign, Tag, FileText } from "lucide-react";
import { t } from "../../lib/i18n";
import { FinanceRecord } from "../../lib/finance";

interface AddFinanceRecordModalProps {
  onClose: () => void;
  onSave: (record: FinanceRecord) => void;
  initialDate?: Date;
}

const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Healthcare",
  "Education",
  "Entertainment",
  "Clothing",
  "Charity",
  "Other",
];

const INCOME_CATEGORIES = ["Salary", "Business", "Investment", "Gift", "Other"];

const AddFinanceRecordModal = ({
  onClose,
  onSave,
  initialDate = new Date(),
}: AddFinanceRecordModalProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(initialDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !category) return;

    const newRecord: FinanceRecord = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: date.toISOString(),
      createdAt: new Date().toISOString(),
    };

    onSave(newRecord);
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {t("finance.addRecord")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Type selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("finance.type")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${type === "expense" ? "bg-red-100 text-red-700 border border-red-200" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                {t("finance.expense")}
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${type === "income" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                {t("finance.income")}
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("finance.amount")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("finance.description")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t("finance.descriptionPlaceholder")}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("finance.category")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-slate-500" />
              </div>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                required
              >
                <option value="">{t("finance.selectCategory")}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("finance.date")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="date"
                id="date"
                value={date.toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFinanceRecordModal;
