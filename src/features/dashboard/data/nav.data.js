// Icons
import { Coins, Gamepad2, TriangleAlert } from "lucide-react";

// Bosh sahifadagi asosiy kartalar
const topNavItems = [
  {
    to: "/penalties",
    label: "Jarimalar",
    description: "Jarimalaringizni ko'rish uchun",
    icon: TriangleAlert,
    gradientFrom: "from-orange-400",
    gradientTo: "to-orange-700",
  },
  {
    to: "/transactions",
    label: "Tangalar",
    description: "Tanga tranzaksiyalari tarixi",
    icon: Coins,
    gradientFrom: "from-amber-400",
    gradientTo: "to-amber-700",
  },
  {
    to: "/games",
    label: "O'yinlar",
    description: "Aqlingizni chiniqtirish uchun",
    icon: Gamepad2,
    gradientFrom: "from-yellow-400",
    gradientTo: "to-yellow-700",
  },
];

export { topNavItems };
