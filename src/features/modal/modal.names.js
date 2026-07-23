/**
 * Registry of every modal name in the student panel.
 *
 * A `<ResponsiveModal name="...">` and every `openModal("...")` call must use a
 * name from this list. Adding a new modal? Register its name here first — in dev,
 * opening an unregistered name logs a warning so typos surface immediately.
 */
export const MODAL_NAMES = [
  "profile",
  "marketOrder",
  "cancelMarketOrder",

  // Bug Report
  "bugReport",

  // Premium
  "premiumBuy",
  "emojiSelector",

  // Penalties
  "fineReductionPackages",
  "purchaseReductionPackage",
];
