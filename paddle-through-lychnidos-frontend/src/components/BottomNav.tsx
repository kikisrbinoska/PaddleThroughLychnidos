import { NavLink } from "react-router-dom";
import { Home, Store, Map, Route, BookOpen, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/shops", label: "Shops", icon: Store },
  { to: "/map", label: "Map", icon: Map },
  { to: "/itineraries", label: "Routes", icon: Route },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1100] border-t border-border-default bg-surface-card">
      <ul className="flex items-center justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  isActive ? "text-primary-800" : "text-text-secondary"
                }`
              }
            >
              <Icon size={22} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
