// "Mening moliyam" sahifasining qayta ishlatiladigan statik ma'lumotlari.

/** Oylik majburiyat holati uchun badge. */
export const INVOICE_STATUS_META = {
  unpaid: { label: "To'lanmagan", className: "bg-red-100 text-red-600" },
  partial: { label: "Qisman to'langan", className: "bg-amber-100 text-amber-700" },
  paid: { label: "To'langan", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Bekor qilingan", className: "bg-gray-100 text-gray-500" },
};

/** Moliyaviy holat uchun badge. */
export const FINANCE_STATUS_META = {
  active: { label: "Faol", className: "bg-green-100 text-green-700" },
  frozen: { label: "Muzlatilgan", className: "bg-blue-100 text-blue-700" },
  expelled: { label: "Chetlatilgan", className: "bg-red-100 text-red-600" },
};

/** To'lov usullari. */
export const PAYMENT_METHOD_LABELS = {
  cash: "Naqd",
  card: "Plastik",
  transfer: "O'tkazma",
  other: "Boshqa",
};

/** Tarif topilmagan hollar uchun izoh (server `tariffReason` maydoni). */
export const TARIFF_REASON_LABELS = {
  no_assignment: "Sizga hali tarif biriktirilmagan",
  no_price: "Bu oy uchun tarif narxi belgilanmagan",
};

/** Oy nomlari — YYYYMM kalitini ko'rsatish uchun. */
export const MONTH_NAMES_UZ = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

/**
 * 202609 → "Sentabr 2026".
 * @param {number|null} monthKey
 * @returns {string}
 */
export const formatMonthKey = (monthKey) => {
  if (monthKey == null) return "—";
  const name = MONTH_NAMES_UZ[(monthKey % 100) - 1];
  return name ? `${name} ${Math.trunc(monthKey / 100)}` : String(monthKey);
};
