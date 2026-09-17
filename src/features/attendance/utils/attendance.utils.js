/**
 * Joriy oy kaliti (YYYYMM) — TOSHKENT vaqti bo'yicha, serverdagi
 * `currentMonthKey()` bilan bir xil. Qurilma soat mintaqasi boshqacha
 * bo'lsa ham oy chegarasida "keyingi oy" tugmasi adashmaydi.
 * O'zbekistonda yozgi vaqt yo'q — fiks +5 xavfsiz.
 * @returns {number}
 */
export const currentMonthKey = () => tashkentToday().monthKey;

/**
 * Bugungi kun — TOSHKENT vaqti bo'yicha: `{ monthKey, day }`.
 * @returns {{monthKey: number, day: number}}
 */
export const tashkentToday = () => {
  const tashkent = new Date(new Date().getTime() + 5 * 3600000);
  return {
    monthKey: tashkent.getUTCFullYear() * 100 + (tashkent.getUTCMonth() + 1),
    day: tashkent.getUTCDate(),
  };
};

/**
 * Oy kalitini `delta` oyga suradi: (202601, -1) → 202512.
 * @param {number} monthKey
 * @param {number} delta
 * @returns {number}
 */
export const shiftMonthKey = (monthKey, delta) => {
  const index = Math.trunc(monthKey / 100) * 12 + (monthKey % 100) - 1 + delta;
  return Math.trunc(index / 12) * 100 + (index % 12) + 1;
};

/** Oydagi kunlar soni. */
export const daysInMonthKey = (monthKey) =>
  new Date(Date.UTC(Math.trunc(monthKey / 100), monthKey % 100, 0)).getUTCDate();

/**
 * Oyning 1-kuni haftaning nechanchi kuniga tushadi (0 = dushanba).
 * @param {number} monthKey
 * @returns {number}
 */
export const firstWeekdayOfMonthKey = (monthKey) => {
  const day = new Date(
    Date.UTC(Math.trunc(monthKey / 100), (monthKey % 100) - 1, 1),
  ).getUTCDay();
  return (day + 6) % 7;
};

/**
 * Davomat sanasi Toshkent kunining UTC YARIM TUNIDA saqlanadi. Formatlovchi
 * qurilmaning mahalliy vaqtida o'qigani uchun o'sha kalendar kunini mahalliy
 * yarim tunga ko'chiramiz — aks holda manfiy mintaqada kun bittaga siljirdi.
 * @param {string|Date} value
 * @returns {Date|null}
 */
export const toLocalDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};
