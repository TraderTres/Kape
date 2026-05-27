"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderWithDetails } from "@/types";

// ─────────────────────────────────────────────────────────────
// Get order history for current user
// ─────────────────────────────────────────────────────────────

export async function getOrderHistory(): Promise<OrderWithDetails[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders as OrderWithDetails[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Admin: get all orders with metrics
// ─────────────────────────────────────────────────────────────

export async function getAdminOrderMetrics() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return null;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrdersThisMonth,
      activeSubscribers,
      mrrResult,
      allUsers,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.subscription.count({
        where: { status: "ACTIVE" },
      }),
      prisma.subscription.findMany({
        where: { status: "ACTIVE" },
        select: { priceAtSubscription: true, tier: true },
      }),
      prisma.user.aggregate({
        _avg: { loyaltyPoints: true },
        where: { role: "USER" },
      }),
    ]);

    // Calculate MRR: bi-weekly subs count as 2x monthly
    const mrr = mrrResult.reduce((sum: number, sub: any) => {
      const price = Number(sub.priceAtSubscription);
      return sum + (sub.tier === "BIWEEKLY" ? price * 2 : price);
    }, 0);

    return {
      totalOrdersThisMonth,
      activeSubscribers,
      mrr,
      avgPointsPerUser: Math.round(allUsers._avg.loyaltyPoints ?? 0),
      subscriberGrowth: 12, // placeholder
      mrrGrowth: 8,         // placeholder
    };
  } catch {
    return null;
  }
}
