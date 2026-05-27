import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Coffee,
  ChevronRight,
  Settings,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | Kape",
  },
};

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Strict admin-only guard
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin top bar */}
      <div className="bg-espresso-950 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coffee className="h-5 w-5 text-gold-300" aria-hidden="true" />
          <span className="font-heading font-bold text-sm tracking-wider">
            KAPE ADMIN
          </span>
        </div>
        <Link
          href="/"
          className="text-xs text-espresso-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Back to site
        </Link>
      </div>

      <div className="flex">
        {/* Admin sidebar */}
        <aside className="w-56 shrink-0 min-h-screen bg-white border-r border-slate-200 pt-6 px-3">
          <nav aria-label="Admin navigation">
            {adminNavItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 cursor-pointer mb-1"
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-700" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/admin/settings"
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                <Settings className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-700" aria-hidden="true" />
                Settings
              </Link>
            </div>
          </nav>
        </aside>

        {/* Admin content */}
        <main className="flex-1 p-8" id="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
