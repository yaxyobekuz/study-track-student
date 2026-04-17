export const marketTabs = [
  { value: "products", label: "Mahsulotlar", path: "/market/products" },
  { value: "orders", label: "Buyurtmalarim", path: "/market/orders" },
];

export const marketOrderStatusLabels = {
  pending: "Kutilmoqda",
  delivering: "Yetkazilmoqda",
  approved: "Yetkazib berildi",
  rejected: "Rad etilgan",
  cancelled: "Bekor qilingan",
};

export const marketOrderStatusClasses = {
  pending: "bg-yellow-100 text-yellow-700",
  delivering: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};
