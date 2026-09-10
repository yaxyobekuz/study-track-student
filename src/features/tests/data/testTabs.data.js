// "Testlar" markazi sahifasidagi tablar (URL bo'yicha)
//
// ⚠️ "Diagnostika" — ALOHIDA TAB, "Testlar" bilan bir xil narsa emas.
// "Testlar" o'qituvchi qo'ygan baho uchun (natija jurnalga tushadi,
// tanga beriladi); "Diagnostika" esa o'quvchi QAYERDA turganini
// o'lchaydi — baho qo'yilmaydi, kamchilik va o'quv rejasi chiqadi.
// Pastki navbarga alohida joy qo'shilmadi: u 5 ta yo'nalishga to'la va
// oltinchisi mobil ekranda siqilib qolardi.
export const testTabs = [
  { value: "available", label: "Testlar", path: "/tests/available" },
  { value: "diagnostics", label: "Diagnostika", path: "/tests/diagnostics" },
  { value: "results", label: "Natijalar", path: "/tests/results" },
  { value: "rating", label: "Reyting", path: "/tests/rating" },
];
