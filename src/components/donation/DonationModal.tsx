import { useState, useEffect } from "react";
import { X, Heart, AlertCircle } from "lucide-react";
import { useAuthContext } from "../auth/AuthContext";
import {
  getOrCreateWallet,
  makeDonation,
  formatCurrency,
  Wallet,
} from "../../lib/wallet";
import { t } from "../../lib/i18n";
import AuthModal from "../auth/AuthModal";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const { user } = useAuthContext();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const predefinedAmounts = [10000, 25000, 50000, 100000];

  useEffect(() => {
    if (isOpen && user) {
      loadWallet();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      setSelectedAmount(null);
      setCustomAmount("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const loadWallet = () => {
    if (!user) return;

    try {
      const userWallet = getOrCreateWallet(user.id);
      setWallet(userWallet);
    } catch (err) {
      setError("Failed to load wallet data");
    }
  };

  const handleDonate = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!wallet) return;

    const amount =
      selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

    if (!amount || amount <= 0) {
      setError("Please select or enter a valid donation amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (amount > wallet.balance) {
        throw new Error(
          `Insufficient balance. Your current balance is ${formatCurrency(wallet.balance, wallet.currency)}`,
        );
      }

      const result = makeDonation(wallet, amount, "Donation to Digital Tasbih");
      setWallet(result.wallet);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process donation",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (user) {
      loadWallet();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-rose-600 text-white">
            <h2 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              {t("donation.title")}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-rose-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {t("donation.thanks")}
                </h3>
                <p className="text-slate-600 mb-6">
                  Your donation of{" "}
                  {formatCurrency(
                    selectedAmount || parseFloat(customAmount),
                    wallet?.currency,
                  )}{" "}
                  has been received.
                </p>
                <button
                  onClick={onClose}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-600 mb-6">{t("donation.subtitle")}</p>

                {error && (
                  <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {user && wallet && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-md text-sm text-slate-600">
                    Your wallet balance:{" "}
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("donation.amount")}
                  </label>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={`py-2 px-4 rounded-md text-sm font-medium ${selectedAmount === amount ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                      >
                        {formatCurrency(amount, "IDR")}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">Rp</span>
                    </div>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Custom amount"
                      min="1000"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDonate}
                  disabled={isLoading || (!selectedAmount && !customAmount)}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : (
                    <Heart className="h-5 w-5 mr-2" />
                  )}
                  {t("donation.donate")}
                </button>

                {!user && (
                  <p className="mt-4 text-sm text-slate-500 text-center">
                    You need to be logged in to donate. Please{" "}
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="text-rose-600 hover:text-rose-500 font-medium"
                    >
                      login or register
                    </button>
                    .
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default DonationModal;
