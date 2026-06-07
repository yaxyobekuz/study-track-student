// Icons
import {
  Coins,
  Award,
  Trophy,
  Gamepad2,
  ListChecks,
  TriangleAlert,
} from "lucide-react";

const topNavItems = [
  {
    to: "/available-tests",
    label: "Mavjud testlar",
    description: "Sizga tayyorlangan testlarni topshiring",
    icon: ListChecks,
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-700",
  },
  {
    to: "/my-results",
    label: "Natijalarim",
    description: "Test natijalaringizni kuzating",
    icon: Award,
    gradientFrom: "from-emerald-400",
    gradientTo: "to-emerald-700",
  },
  {
    to: "/seasons",
    label: "Mavsumlar",
    description: "Reyting va mukofotlar",
    icon: Trophy,
    gradientFrom: "from-purple-400",
    gradientTo: "to-purple-700",
  },
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
