import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPoints } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subscribers",
};

const TIER_CLASSES: Record<string, string> = {
  BRONZE: "bg-amber-50 text-amber-800 border border-amber-200",
  SILVER: "bg-gray-50 text-gray-700 border border-gray-200",
  GOLD: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  PLATINUM: "bg-purple-50 text-purple-800 border border-purple-200",
};

export default async function AdminSubscribersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?error=unauthorized");
  }

  const subscribers = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      loyaltyTier: true,
      loyaltyPoints: true,
      _count: {
        select: {
          subscriptions: { where: { status: "ACTIVE" } },
          orders: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-slate-900 text-3xl">
          Subscribers
        </h1>
        <p className="text-slate-500 mt-1">
          {subscribers.length} registered users
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm" role="table" aria-label="Subscriber list">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {["Name", "Email", "Tier", "Points", "Active Subs", "Orders", "Joined"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subscribers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-espresso-100 flex items-center justify-center text-espresso-700 font-heading font-bold text-sm shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500">{user.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      TIER_CLASSES[user.loyaltyTier]
                    }`}
                  >
                    {user.loyaltyTier}
                  </span>
                </td>
                <td className="px-5 py-4 font-heading font-semibold text-gold-700">
                  {formatPoints(user.loyaltyPoints)}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={user._count.subscriptions > 0 ? "green" : "gray"}
                  >
                    {user._count.subscriptions}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-600">{user._count.orders}</td>
                <td className="px-5 py-4 text-slate-400">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-16 text-center text-slate-400"
                >
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
