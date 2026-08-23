import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  BadgeCheck,
  MapPin,
  Tag,
  Route,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: AdminNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/shops/pending", label: "Shop Approvals", icon: Store },
  { to: "/admin/verifications", label: "Verify Artisans", icon: BadgeCheck },
  { to: "/admin/regions", label: "Regions", icon: MapPin },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/itineraries", label: "Itineraries", icon: Route },
];

export interface AdminLayoutProps {
  children: ReactNode;
}

// Desktop-first by design (sidebar + wide content), unlike the rest of the
// mobile-first app - admins realistically manage the platform from a
// laptop/desktop. Still usable on tablet/mobile: the sidebar collapses to a
// horizontal scrollable top bar below the md breakpoint.
export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-svh bg-surface-bg md:flex">
      <aside className="flex flex-col border-b border-border-default bg-surface-card md:w-64 md:flex-none md:border-b-0 md:border-r">
        <div className="px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Paddle through Lychnidos
          </p>
          <h1 className="text-lg font-extrabold text-primary-900">Admin</h1>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex flex-none items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold md:flex-1 ${
                  isActive
                    ? "bg-primary-900 text-white"
                    : "text-text-primary hover:bg-primary-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-2 border-t border-border-default px-4 py-3 md:flex-col md:items-stretch">
          {user && (
            <p className="truncate px-2 text-xs text-text-secondary">
              Signed in as <span className="font-semibold text-text-primary">{user.username}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-none items-center justify-center gap-2 rounded-xl border border-nosija-red-700 px-3 py-2 text-sm font-semibold text-nosija-red-700 hover:bg-nosija-red-100"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
