export const transactionTypeLabels = {
  daily: "Kunlik tanga",
  weekly_school_bonus: "Haftalik maktab bonusi",
  weekly_class_bonus: "Haftalik sinf bonusi",
  market_purchase: "Do'kon xaridi",
  market_refund: "Do'kon qaytimi",
  manual_give: "Tanga berildi",
  manual_take: "Tanga olindi",
  premium_purchase: "Premium obuna",
  fine_reduction_purchase: "Jarima kamaytirishga sarflandi",
  // Ikki yo'nalishli: yo'nalishi SUMMA ishorasida (`isDebitTransaction`)
  branch_transfer: "Filiallararo o'tkazma",
};

export const debitTransactionTypes = [
  "market_purchase",
  "manual_take",
  "premium_purchase",
  "fine_reduction_purchase",
];

/**
 * Chiqimmi? Odatiy turlarda yo'nalish TURDAN (summa musbat saqlanadi),
 * ikki yo'nalishli turda (filiallararo o'tkazma) — summa ishorasidan.
 */
export const isDebitTransaction = (tx) =>
  debitTransactionTypes.includes(tx.type) || Number(tx.amount) < 0;
