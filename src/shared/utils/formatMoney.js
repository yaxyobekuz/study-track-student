/**
 * Pul summasini ko'rsatish uchun formatlaydi: "450000.00" → "450 000 so'm".
 *
 * Server summani DOIM 2 xonali STRING sifatida qaytaradi (Postgres NUMERIC),
 * chunki JS'ning `number` turi katta summalarda aniqlikni yo'qotadi. Shuning
 * uchun bu yerda `Number()` faqat KO'RSATISH uchun ishlatiladi — panelda
 * summalar ustida arifmetika qilinmaydi, yig'indi/farqni server hisoblab beradi.
 */

// Butun summa kasrsiz, tiyinli summa esa to'liq ikki xona bilan ko'rsatiladi
const wholeFormatter = new Intl.NumberFormat("uz-UZ", {
  maximumFractionDigits: 0,
});

const fractionalFormatter = new Intl.NumberFormat("uz-UZ", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * @param {string|number|null|undefined} value - summa (odatda "450000.00")
 * @param {object} [options]
 * @param {string} [options.fallback="—"]
 * @param {boolean} [options.withLabel=true] - "so'm" qo'shilsinmi
 * @returns {string}
 */
export const formatMoney = (value, { fallback = "—", withLabel = true } = {}) => {
  if (value == null || value === "") return fallback;

  const amount = Number(value);
  if (Number.isNaN(amount)) return fallback;

  const formatter = Number.isInteger(amount)
    ? wholeFormatter
    : fractionalFormatter;

  return withLabel
    ? `${formatter.format(amount)} so'm`
    : formatter.format(amount);
};

export default formatMoney;
