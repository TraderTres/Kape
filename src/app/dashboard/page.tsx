import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserSubscriptions } from "@/actions/subscription";
import { getOrderHistory } from "@/actions/orders";
import { getUserLoyaltyData } from "@/actions/loyalty";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatPHP, formatDate, formatPoints, getNextTierInfo, TIER_CONFIG } from "@/lib/utils";
import { Package, ShoppingBag, Star, ArrowRight, Coffee } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const [subscriptions, orders, loyaltyData] = await Promise.all([
    getUserSubscriptions(),
    getOrderHistory(),
    getUserLoyaltyData(),
  ]);

  const activeSubscriptions = subscriptions.filter((s) => s.status === "ACTIVE");
  const { progressPercent, pointsNeeded, nextTier } = getNextTierInfo(
    loyaltyData?.points ?? 0
  );

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="font-heading font-bold text-espresso-900 text-3xl">
          Good day, {session.user.name?.split(" ")[0]}! ☕
        </h1>
        <p className="text-espresso-500 mt-1">
          Here&apos;s an overview of your Kape account.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-100">
              <Package className="h-4 w-4 text-espresso-700" aria-hidden="true" />
            </div>
            <p className="text-sm text-espresso-500">Active Subscriptions</p>
          </div>
          <p className="font-heading text-3xl font-bold text-espresso-900">
            {activeSubscriptions.length}
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-100">
              <Star className="h-4 w-4 text-gold-600" aria-hidden="true" />
            </div>
            <p className="text-sm text-espresso-500">Kape Points</p>
          </div>
          <p className="font-heading text-3xl font-bold text-gold-600">
            {formatPoints(loyaltyData?.points ?? 0)}
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-100">
              <ShoppingBag className="h-4 w-4 text-espresso-700" aria-hidden="true" />
            </div>
            <p className="text-sm text-espresso-500">Total Orders</p>
          </div>
          <p className="font-heading text-3xl font-bold text-espresso-900">
            {orders.length}
          </p>
        </Card>
      </div>

      {/* Loyalty tier card */}
      {loyaltyData && (
        <Card padding="lg" className="bg-espresso-gradient text-white border-0">
          <CardHeader>
            <CardTitle className="text-white font-heading">
              {TIER_CONFIG[loyaltyData.tier].label} Member
            </CardTitle>
            <Badge variant="gold">
              {formatPoints(loyaltyData.points)} pts
            </Badge>
          </CardHeader>
          {nextTier && (
            <>
              <ProgressBar
                value={loyaltyData.points}
                max={loyaltyData.nextTierPoints}
                color="gold"
                className="mb-2"
              />
              <p className="text-xs text-espresso-300">
                {formatPoints(pointsNeeded ?? 0)} pts to {TIER_CONFIG[nextTier].label}
              </p>
            </>
          )}
          <div className="mt-4">
            <Link href="/dashboard/loyalty">
              <Button variant="gold" size="sm">
                View Quests
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Active subscriptions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-espresso-900 text-xl">
            Active Subscriptions
          </h2>
          <Link href="/dashboard/subscriptions">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {activeSubscriptions.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Coffee className="h-10 w-10 text-espresso-300 mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-heading font-semibold text-espresso-800 mb-1">
              No active subscriptions
            </h3>
            <p className="text-sm text-espresso-500 mb-4">
              Subscribe to your first Philippine coffee today!
            </p>
            <Link href="/subscribe">
              <Button variant="gold" size="md">
                Browse & Subscribe
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeSubscriptions.slice(0, 3).map((sub) => (
              <Card key={sub.id} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-espresso-100 flex items-center justify-center">
                      <Coffee className="h-5 w-5 text-espresso-700" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-espresso-900">{sub.coffee.name}</p>
                      <p className="text-xs text-espresso-500">
                        {sub.tier === "BIWEEKLY" ? "Bi-weekly" : "Monthly"} •{" "}
                        {formatPHP(sub.priceAtSubscription)}/delivery
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="green" size="sm">Active</Badge>
                    <p className="text-xs text-espresso-400 mt-1">
                      Next: {formatDate(sub.nextDeliveryAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-espresso-900 text-xl">
              Recent Orders
            </h2>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id} padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-espresso-900 font-heading text-sm">
                      #{order.orderNumber.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-espresso-500 mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-espresso-900">
                      {formatPHP(order.total)}
                    </p>
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "green"
                          : order.status === "CANCELLED"
                          ? "gray"
                          : "gold"
                      }
                      size="sm"
                      className="mt-1"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
