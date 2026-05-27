import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPHP, ORIGIN_LABELS, ROAST_LABELS } from "@/lib/utils";
import { AlertTriangle, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function AdminInventoryPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?error=unauthorized");
  }

  const coffees = await prisma.coffee.findMany({
    include: {
      _count: {
        select: { subscriptions: { where: { status: "ACTIVE" } } },
      },
    },
    orderBy: { stockLevel: "asc" },
  });

  const totalStock = coffees.reduce((s, c) => s + c.stockLevel, 0);
  const lowStock = coffees.filter((c) => c.stockLevel < 20);

  function getStockStatus(level: number) {
    if (level === 0) return { label: "Out of Stock", color: "text-red-600", barColor: "bg-red-400" };
    if (level < 20) return { label: "Low Stock", color: "text-orange-600", barColor: "bg-orange-400" };
    if (level < 50) return { label: "Limited", color: "text-yellow-600", barColor: "bg-yellow-400" };
    return { label: "In Stock", color: "text-emerald-600", barColor: "bg-emerald-400" };
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-slate-900 text-3xl">
          Inventory Management
        </h1>
        <p className="text-slate-500 mt-1">
          {coffees.length} products • {totalStock} bags in stock
        </p>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl bg-orange-50 border border-orange-200 p-5">
          <AlertTriangle
            className="h-5 w-5 text-orange-500 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium text-orange-800">
              {lowStock.length} item{lowStock.length > 1 ? "s" : ""} need restocking
            </p>
            <p className="text-sm text-orange-600 mt-0.5">
              {lowStock.map((c) => c.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Inventory grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {coffees.map((coffee) => {
          const { label, color, barColor } = getStockStatus(coffee.stockLevel);
          const maxStock = 200;
          const pct = Math.min((coffee.stockLevel / maxStock) * 100, 100);

          return (
            <div
              key={coffee.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-slate-900 text-base leading-snug">
                    {coffee.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ORIGIN_LABELS[coffee.origin]} • {ROAST_LABELS[coffee.roastLevel]}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-heading font-bold text-slate-900">
                    {formatPHP(coffee.pricePerBag)}
                  </p>
                  <p className="text-xs text-slate-400">per bag</p>
                </div>
              </div>

              {/* Stock bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={`font-medium ${color}`}>{label}</span>
                  <span className="text-slate-500">
                    {coffee.stockLevel} / {maxStock} bags
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={coffee.stockLevel}
                    aria-valuemin={0}
                    aria-valuemax={maxStock}
                    aria-label={`${coffee.name} stock level`}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" aria-hidden="true" />
                  {coffee._count.subscriptions} active subscriptions
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    coffee.isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {coffee.isAvailable ? "Listed" : "Hidden"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
