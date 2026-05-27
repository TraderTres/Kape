import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminOrderMetrics } from "@/actions/orders";
import { prisma } from "@/lib/prisma";
import { formatPHP, formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, Package, ShoppingBag, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Overview",
};

async function getRecentSubscribers() {
  return prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      loyaltyTier: true,
      loyaltyPoints: true,
      _count: { select: { subscriptions: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

async function getInventoryAlerts() {
  return prisma.coffee.findMany({
    where: { stockLevel: { lt: 50 } },
    select: { name: true, origin: true, stockLevel: true, isAvailable: true },
    orderBy: { stockLevel: "asc" },
    take: 5,
  });
}

const TIER_BADGE_COLOR: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-800",
  SILVER: "bg-gray-100 text-gray-700",
  GOLD: "bg-yellow-100 text-yellow-800",
  PLATINUM: "bg-purple-100 text-purple-800",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?error=unauthorized");
  }

  const [metrics, recentUsers, inventoryAlerts] = await Promise.all([
    getAdminOrderMetrics(),
    getRecentSubscribers(),
    getInventoryAlerts(),
  ]);

  const metricCards = [
    {
      label: "Active Subscribers",
      value: metrics?.activeSubscribers.toLocaleString() ?? "—",
      growth: `+${metrics?.subscriberGrowth ?? 0}%`,
      isPositive: true,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Monthly Recurring Revenue",
      value: metrics ? formatPHP(metrics.mrr) : "—",
      growth: `+${metrics?.mrrGrowth ?? 0}%`,
      isPositive: true,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Orders This Month",
      value: metrics?.totalOrdersThisMonth.toLocaleString() ?? "—",
      growth: "vs last month",
      isPositive: true,
      icon: ShoppingBag,
      color: "bg-gold-50 text-gold-600",
    },
    {
      label: "Avg Points / User",
      value: metrics?.avgPointsPerUser.toLocaleString() ?? "—",
      growth: "Kape Points",
      isPositive: true,
      icon: Star,
      color: "bg-espresso-50 text-espresso-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-slate-900 text-3xl">
          Admin Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Business metrics and platform health at a glance.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ label, value, growth, isPositive, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {growth}
              </div>
            </div>
            <p className="font-heading text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent subscribers */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-slate-900 text-lg">
              Recent Subscribers
            </h2>
            <a
              href="/admin/subscribers"
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              View all
            </a>
          </div>

          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-espresso-100 flex items-center justify-center text-espresso-700 font-heading font-bold text-sm">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user.name || "Unknown User"}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      TIER_BADGE_COLOR[user.loyaltyTier]
                    }`}
                  >
                    {user.loyaltyTier}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            ))}

            {recentUsers.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No subscribers yet.
              </p>
            )}
          </div>
        </div>

        {/* Low inventory alerts */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-slate-900 text-lg">
              Inventory Alerts
            </h2>
            <a
              href="/admin/inventory"
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Manage inventory
            </a>
          </div>

          <div className="space-y-3">
            {inventoryAlerts.map((coffee) => (
              <div
                key={coffee.name}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      coffee.stockLevel === 0
                        ? "bg-red-500"
                        : coffee.stockLevel < 20
                        ? "bg-orange-400"
                        : "bg-yellow-400"
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{coffee.name}</p>
                    <p className="text-xs text-slate-400">{coffee.origin}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      coffee.stockLevel === 0
                        ? "text-red-600"
                        : coffee.stockLevel < 20
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {coffee.stockLevel} bags
                  </p>
                  {!coffee.isAvailable && (
                    <span className="text-xs text-red-500">Unavailable</span>
                  )}
                </div>
              </div>
            ))}

            {inventoryAlerts.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <Package className="h-10 w-10 text-emerald-300 mb-2" aria-hidden="true" />
                <p className="text-sm text-slate-500">All inventory levels are healthy!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
