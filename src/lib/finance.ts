// Types for finance records
export interface FinanceRecord {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

// Local storage key
const FINANCE_RECORDS_KEY = "digital-tasbih-finance-records";

// Get all finance records
export const getFinanceRecords = (): FinanceRecord[] => {
  try {
    const recordsJson = localStorage.getItem(FINANCE_RECORDS_KEY);
    if (recordsJson) {
      return JSON.parse(recordsJson);
    }
    return [];
  } catch (error) {
    console.error("Error getting finance records:", error);
    return [];
  }
};

// Add a finance record
export const addFinanceRecord = (record: FinanceRecord): FinanceRecord[] => {
  try {
    const records = getFinanceRecords();
    const updatedRecords = [record, ...records];
    localStorage.setItem(FINANCE_RECORDS_KEY, JSON.stringify(updatedRecords));
    return updatedRecords;
  } catch (error) {
    console.error("Error adding finance record:", error);
    return getFinanceRecords();
  }
};

// Delete a finance record
export const deleteFinanceRecord = (id: string): FinanceRecord[] => {
  try {
    const records = getFinanceRecords();
    const updatedRecords = records.filter((record) => record.id !== id);
    localStorage.setItem(FINANCE_RECORDS_KEY, JSON.stringify(updatedRecords));
    return updatedRecords;
  } catch (error) {
    console.error("Error deleting finance record:", error);
    return getFinanceRecords();
  }
};

// Get finance records by date range
export const getFinanceRecordsByDateRange = (
  startDate: Date,
  endDate: Date,
): FinanceRecord[] => {
  try {
    const records = getFinanceRecords();
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  } catch (error) {
    console.error("Error getting finance records by date range:", error);
    return [];
  }
};

// Get finance records by type
export const getFinanceRecordsByType = (
  type: "income" | "expense",
): FinanceRecord[] => {
  try {
    const records = getFinanceRecords();
    return records.filter((record) => record.type === type);
  } catch (error) {
    console.error("Error getting finance records by type:", error);
    return [];
  }
};

// Get finance records by category
export const getFinanceRecordsByCategory = (
  category: string,
): FinanceRecord[] => {
  try {
    const records = getFinanceRecords();
    return records.filter((record) => record.category === category);
  } catch (error) {
    console.error("Error getting finance records by category:", error);
    return [];
  }
};

// Get total income for a date range
export const getTotalIncome = (startDate: Date, endDate: Date): number => {
  try {
    const records = getFinanceRecordsByDateRange(startDate, endDate);
    return records
      .filter((record) => record.type === "income")
      .reduce((sum, record) => sum + record.amount, 0);
  } catch (error) {
    console.error("Error calculating total income:", error);
    return 0;
  }
};

// Get total expense for a date range
export const getTotalExpense = (startDate: Date, endDate: Date): number => {
  try {
    const records = getFinanceRecordsByDateRange(startDate, endDate);
    return records
      .filter((record) => record.type === "expense")
      .reduce((sum, record) => sum + record.amount, 0);
  } catch (error) {
    console.error("Error calculating total expense:", error);
    return 0;
  }
};

// Get balance for a date range
export const getBalance = (startDate: Date, endDate: Date): number => {
  try {
    const totalIncome = getTotalIncome(startDate, endDate);
    const totalExpense = getTotalExpense(startDate, endDate);
    return totalIncome - totalExpense;
  } catch (error) {
    console.error("Error calculating balance:", error);
    return 0;
  }
};

// Get expense breakdown by category for a date range
export const getExpenseBreakdown = (
  startDate: Date,
  endDate: Date,
): Record<string, number> => {
  try {
    const records = getFinanceRecordsByDateRange(startDate, endDate);
    const expenseRecords = records.filter(
      (record) => record.type === "expense",
    );

    return expenseRecords.reduce(
      (breakdown, record) => {
        const { category, amount } = record;
        if (!breakdown[category]) {
          breakdown[category] = 0;
        }
        breakdown[category] += amount;
        return breakdown;
      },
      {} as Record<string, number>,
    );
  } catch (error) {
    console.error("Error calculating expense breakdown:", error);
    return {};
  }
};

// Export finance records to a JSON file
export const exportFinanceRecords = (): void => {
  try {
    const records = getFinanceRecords();
    const recordsJson = JSON.stringify(records, null, 2);
    const blob = new Blob([recordsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-records-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error exporting finance records:", error);
    throw error;
  }
};

// Import finance records from a JSON file
export const importFinanceRecords = (jsonContent: string): void => {
  try {
    const importedRecords = JSON.parse(jsonContent);

    // Validate the imported data
    if (!Array.isArray(importedRecords)) {
      throw new Error("Invalid records format: not an array");
    }

    // Check if each item has the required properties
    for (const item of importedRecords) {
      if (
        !item.id ||
        !item.type ||
        typeof item.amount !== "number" ||
        !item.description
      ) {
        throw new Error("Invalid record item format");
      }
    }

    // Merge with existing records (avoid duplicates by ID)
    const existingRecords = getFinanceRecords();
    const existingIds = new Set(existingRecords.map((item) => item.id));

    const newItems = importedRecords.filter(
      (item) => !existingIds.has(item.id),
    );
    const mergedRecords = [...existingRecords, ...newItems];

    // Sort by date (newest first)
    mergedRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    localStorage.setItem(FINANCE_RECORDS_KEY, JSON.stringify(mergedRecords));
  } catch (error) {
    console.error("Error importing finance records:", error);
    throw error;
  }
};
