import { useState, useEffect } from "react";
import {
  X,
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  History,
} from "lucide-react";
import { useAuthContext } from "../auth/AuthContext";
import {
  getOrCreateWallet,
  getTransactions,
  topUpWallet,
  withdrawFromWallet,
  formatCurrency,
  Wallet,
  Transaction,
} from "../../lib/wallet";
import { t } from "../../lib/i18n";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WalletView = "main" | "topup" | "withdraw" | "history";

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const { user } = useAuthContext();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<WalletView>("main");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadWallet();
    }
  }, [isOpen, user]);

  const loadWallet = () => {
    if (!user) return;

    try {
      const userWallet = getOrCreateWallet(user.id);
      setWallet(userWallet);

      const userTransactions = getTransactions(userWallet.id);
      setTransactions(userTransactions);
    } catch (err) {
      setError("Failed to load wallet data");
    }
  };

  const handleTopUp = async () => {
    if (!wallet || !amount) return;

    setIsLoading(true);
    setError(null);

    try {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const result = topUpWallet(wallet, amountValue);
      setWallet(result.wallet);
      setTransactions([result.transaction, ...transactions]);
      setAmount("");
      setView("main");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to top up wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!wallet || !amount) return;

    setIsLoading(true);
    setError(null);

    try {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }

      if (amountValue > wallet.balance) {
        throw new Error("Insufficient balance");
      }

      const result = withdrawFromWallet(wallet, amountValue);
      setWallet(result.wallet);
      setTransactions([result.transaction, ...transactions]);
      setAmount("");
      setView("main");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to withdraw from wallet",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const renderMainView = () => (
    <div className="p-6">
      <div className="bg-emerald-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-emerald-700">
            {t("wallet.balance")}
          </h3>
          <WalletIcon className="h-5 w-5 text-emerald-600" />
        </div>
        <p className="text-3xl font-bold text-emerald-800">
          {wallet ? formatCurrency(wallet.balance, wallet.currency) : "-"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setView("topup")}
          className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          <ArrowDownLeft className="h-6 w-6 text-emerald-600 mb-2" />
          <span className="text-sm font-medium text-slate-700">
            {t("wallet.topup")}
          </span>
        </button>

        <button
          onClick={() => setView("withdraw")}
          className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          disabled={!wallet || wallet.balance <= 0}
        >
          <ArrowUpRight className="h-6 w-6 text-slate-600 mb-2" />
          <span className="text-sm font-medium text-slate-700">
            {t("wallet.withdraw")}
          </span>
        </button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-md font-medium text-slate-700">
          {t("wallet.history")}
        </h3>
        {transactions.length > 0 && (
          <button
            onClick={() => setView("history")}
            className="text-xs text-emerald-600 flex items-center"
          >
            <History className="h-3 w-3 mr-1" />
            {t("wallet.history")}
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${transaction.type === "topup" ? "bg-emerald-100" : transaction.type === "withdraw" ? "bg-slate-100" : "bg-blue-100"}`}
                >
                  {transaction.type === "topup" ? (
                    <ArrowDownLeft
                      className={`h-4 w-4 ${transaction.type === "topup" ? "text-emerald-600" : transaction.type === "withdraw" ? "text-slate-600" : "text-blue-600"}`}
                    />
                  ) : transaction.type === "withdraw" ? (
                    <ArrowUpRight className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Heart className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {transaction.type === "topup"
                      ? "Top Up"
                      : transaction.type === "withdraw"
                        ? "Withdrawal"
                        : "Donation"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${transaction.type === "topup" ? "text-emerald-600" : "text-slate-700"}`}
              >
                {transaction.type === "topup" ? "+" : "-"}{" "}
                {formatCurrency(transaction.amount, wallet?.currency)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTopUpView = () => (
    <div className="p-6">
      <h3 className="text-lg font-medium text-slate-800 mb-4">
        {t("wallet.topup")}
      </h3>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Amount ({wallet?.currency})
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500">
              {wallet?.currency === "IDR" ? "Rp" : "$"}
            </span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
            min="1"
            step="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setView("main");
            setError(null);
          }}
          className="py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleTopUp}
          disabled={isLoading || !amount}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></span>
          ) : (
            "Top Up"
          )}
        </button>
      </div>
    </div>
  );

  const renderWithdrawView = () => (
    <div className="p-6">
      <h3 className="text-lg font-medium text-slate-800 mb-4">
        {t("wallet.withdraw")}
      </h3>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-2">
        <p className="text-sm text-slate-500">
          Current Balance:{" "}
          {wallet ? formatCurrency(wallet.balance, wallet.currency) : "-"}
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Amount ({wallet?.currency})
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500">
              {wallet?.currency === "IDR" ? "Rp" : "$"}
            </span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
            min="1"
            max={wallet?.balance.toString()}
            step="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setView("main");
            setError(null);
          }}
          className="py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={
            isLoading ||
            !amount ||
            !wallet ||
            parseFloat(amount) > wallet.balance
          }
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></span>
          ) : (
            "Withdraw"
          )}
        </button>
      </div>
    </div>
  );

  const renderHistoryView = () => (
    <div className="p-6">
      <h3 className="text-lg font-medium text-slate-800 mb-4">
        {t("wallet.history")}
      </h3>

      {transactions.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${transaction.type === "topup" ? "bg-emerald-100" : transaction.type === "withdraw" ? "bg-slate-100" : "bg-blue-100"}`}
                >
                  {transaction.type === "topup" ? (
                    <ArrowDownLeft
                      className={`h-4 w-4 ${transaction.type === "topup" ? "text-emerald-600" : transaction.type === "withdraw" ? "text-slate-600" : "text-blue-600"}`}
                    />
                  ) : transaction.type === "withdraw" ? (
                    <ArrowUpRight className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Heart className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {transaction.type === "topup"
                      ? "Top Up"
                      : transaction.type === "withdraw"
                        ? "Withdrawal"
                        : "Donation"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${transaction.type === "topup" ? "text-emerald-600" : "text-slate-700"}`}
              >
                {transaction.type === "topup" ? "+" : "-"}{" "}
                {formatCurrency(transaction.amount, wallet?.currency)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setView("main")}
          className="w-full py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <WalletIcon className="h-5 w-5 mr-2" />
            {t("wallet.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {view === "main" && renderMainView()}
        {view === "topup" && renderTopUpView()}
        {view === "withdraw" && renderWithdrawView()}
        {view === "history" && renderHistoryView()}
      </div>
    </div>
  );
};

export default WalletModal;
