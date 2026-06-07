// Utils
import { cn } from "../../utils/cn";

// Router
import { NavLink } from "react-router-dom";

// Icons
import { Home, User, Store, ClipboardList, ChartNoAxesColumn } from "lucide-react";

const BottomNavbar = () => {
  const navItems = [
    { path: "/dashboard", label: "Asosiy", icon: Home },
    { path: "/tests", label: "Testlar", icon: ClipboardList },
    { path: "/market", label: "Do'kon", icon: Store },
    { path: "/statistics", label: "Statistika", icon: ChartNoAxesColumn },
    { path: "/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="fixed top-auto inset-0 z-20 flex justify-center pb-4">
      <div className="container relative">
        {/* Nav */}
        <nav className="relative z-10 bottom-navigation flex items-center p-1 rounded-full bg-white/90 backdrop-blur xs:p-1.5">
          {navItems.map((nav) => (
            <NavLink
              to={nav.path}
              key={nav.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center relative w-full h-12 rounded-full transition-all duration-300 xs:h-14",
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-white/40 hover:text-gray-900",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <nav.icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className="size-5 mb-0.5 xs:mb-1"
                  />

                  <span
                    className={cn(
                      isActive ? "font-bold" : "font-medium",
                      "text-[10px] xs:text-xs",
                    )}
                  >
                    {nav.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Shadow */}
        <div className="absolute inset-x-0 -bottom-4 z-0 w-full h-16 bg-gradient-to-b from-transparent to-gray-100" />
      </div>
    </div>
  );
};

export default BottomNavbar;
