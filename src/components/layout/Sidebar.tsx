"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: Package },
  { href: "/dashboard/orders", label: "Order History", icon: ShoppingBag },
  { href: "/dashboard/loyalty", label: "Loyalty Quests", icon: Star },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 shrink-0 hidden lg:flex flex-col"
      aria-label="Dashboard navigation"
    >
      <nav className="sticky top-24 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                "transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-espresso-900 text-gold-300 shadow-espresso"
                  : "text-espresso-600 hover:text-espresso-900 hover:bg-espresso-50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-gold-300" : "text-espresso-400 group-hover:text-espresso-700"
                )}
                aria-hidden="true"
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
              )}
            </Link>
          );
        })}

        <div className="mt-4 pt-4 border-t border-espresso-100">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0 text-red-400 group-hover:text-red-600" aria-hidden="true" />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
