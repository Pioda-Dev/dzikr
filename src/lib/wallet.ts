// Types for wallet
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// Types for transactions
export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: "topup" | "withdraw" | "donation";
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
}

// Local storage keys
const WALLET_KEY = "digital-tasbih-wallet";
const TRANSACTIONS_KEY = "digital-tasbih-transactions";

// Helper to generate a unique ID
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Get wallet from local storage
export const getWallet = (userId: string): Wallet | null => {
  try {
    const walletJson = localStorage.getItem(WALLET_KEY);
    if (walletJson) {
      const wallets = JSON.parse(walletJson) as Record<string, Wallet>;
      return wallets[userId] || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting wallet:", error);
    return null;
  }
};

// Create or update wallet
export const saveWallet = (wallet: Wallet): Wallet => {
  try {
    const walletJson = localStorage.getItem(WALLET_KEY);
    const wallets = walletJson
      ? (JSON.parse(walletJson) as Record<string, Wallet>)
      : {};

    wallets[wallet.userId] = {
      ...wallet,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(WALLET_KEY, JSON.stringify(wallets));
    return wallets[wallet.userId];
  } catch (error) {
    console.error("Error saving wallet:", error);
    throw error;
  }
};

// Create a new wallet for a user
export const createWallet = (
  userId: string,
  currency: string = "IDR",
): Wallet => {
  const now = new Date().toISOString();
  const newWallet: Wallet = {
    id: generateId(),
    userId,
    balance: 0,
    currency,
    createdAt: now,
    updatedAt: now,
  };

  return saveWallet(newWallet);
};

// Get or create wallet
export const getOrCreateWallet = (
  userId: string,
  currency: string = "IDR",
): Wallet => {
  const wallet = getWallet(userId);
  if (wallet) return wallet;
  return createWallet(userId, currency);
};

// Get transactions for a wallet
export const getTransactions = (walletId: string): Transaction[] => {
  try {
    const transactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
    if (transactionsJson) {
      const allTransactions = JSON.parse(transactionsJson) as Transaction[];
      return allTransactions
        .filter((t) => t.walletId === walletId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    return [];
  } catch (error) {
    console.error("Error getting transactions:", error);
    return [];
  }
};

// Save a transaction
export const saveTransaction = (transaction: Transaction): Transaction => {
  try {
    const transactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions = transactionsJson
      ? (JSON.parse(transactionsJson) as Transaction[])
      : [];

    transactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

    return transaction;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};

// Top up wallet
export const topUpWallet = (
  wallet: Wallet,
  amount: number,
  description: string = "Top up",
): { wallet: Wallet; transaction: Transaction } => {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  // Create transaction
  const transaction: Transaction = {
    id: generateId(),
    walletId: wallet.id,
    amount,
    type: "topup",
    status: "completed",
    description,
    createdAt: new Date().toISOString(),
  };

  // Update wallet balance
  const updatedWallet: Wallet = {
    ...wallet,
    balance: wallet.balance + amount,
    updatedAt: new Date().toISOString(),
  };

  // Save both
  saveTransaction(transaction);
  saveWallet(updatedWallet);

  return {
    wallet: updatedWallet,
    transaction,
  };
};

// Withdraw from wallet
export const withdrawFromWallet = (
  wallet: Wallet,
  amount: number,
  description: string = "Withdrawal",
): { wallet: Wallet; transaction: Transaction } => {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // Create transaction
  const transaction: Transaction = {
    id: generateId(),
    walletId: wallet.id,
    amount,
    type: "withdraw",
    status: "completed",
    description,
    createdAt: new Date().toISOString(),
  };

  // Update wallet balance
  const updatedWallet: Wallet = {
    ...wallet,
    balance: wallet.balance - amount,
    updatedAt: new Date().toISOString(),
  };

  // Save both
  saveTransaction(transaction);
  saveWallet(updatedWallet);

  return {
    wallet: updatedWallet,
    transaction,
  };
};

// Make a donation
export const makeDonation = (
  wallet: Wallet,
  amount: number,
  description: string = "Donation",
): { wallet: Wallet; transaction: Transaction } => {
  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // Create transaction
  const transaction: Transaction = {
    id: generateId(),
    walletId: wallet.id,
    amount,
    type: "donation",
    status: "completed",
    description,
    createdAt: new Date().toISOString(),
  };

  // Update wallet balance
  const updatedWallet: Wallet = {
    ...wallet,
    balance: wallet.balance - amount,
    updatedAt: new Date().toISOString(),
  };

  // Save both
  saveTransaction(transaction);
  saveWallet(updatedWallet);

  return {
    wallet: updatedWallet,
    transaction,
  };
};

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = "IDR",
): string => {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
};
