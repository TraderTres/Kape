import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSubscriptions } from "@/actions/subscription";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPHP, formatDate, formatDateShort } from "@/lib/utils";
import { Coffee, Package, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Subscriptions",
};

const STATUS_BADGE: Record<string, "green" | "gold" | "gray"> = {
  ACTIVE: "green",
  PAUSED: "gold",
  CANCELLED: "gray",
};

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const subscriptions = await getUserSubscriptions();

  const active = subscriptions.filter((s) => s.status === "ACTIVE");
  const others = subscriptions.filter((s) => s.status !== "ACTIVE");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-espresso-900 text-3xl">
            Subscriptions
          </h1>
          <p className="text-espresso-500 mt-1">
            {active.length} active, {subscriptions.length} total
          </p>
        </div>
        <Link href="/subscribe">
          <Button variant="gold" size="md">
            Add Subscription
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Coffee className="h-12 w-12 text-espresso-200 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-heading font-bold text-espresso-800 text-xl mb-2">
            No subscriptions yet
          </h2>
          <p className="text-espresso-500 text-sm mb-6">
            Subscribe to your first Philippine coffee and start earning Kape Points!
          </p>
          <Link href="/subscribe">
            <Button variant="gold">Browse & Subscribe</Button>
          </Link>
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <section aria-labelledby="active-subs-heading">
              <h2
                id="active-subs-heading"
                className="font-heading font-semibold text-espresso-800 text-lg mb-4"
              >
                Active Subscriptions
              </h2>
              <div className="space-y-4">
                {active.map((sub) => (
                  <Card key={sub.id} padding="lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-espresso-100 flex items-center justify-center shrink-0">
                          <Coffee className="h-6 w-6 text-espresso-700" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-espresso-900 text-lg">
                            {sub.coffee.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="green" size="sm">Active</Badge>
                            <Badge variant="espresso" size="sm">
                              {sub.tier === "BIWEEKLY" ? "Bi-Weekly" : "Monthly"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-0.5">Price</p>
                          <p className="font-semibold text-espresso-900">
                            {formatPHP(sub.priceAtSubscription)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-0.5">
                            Next Delivery
                          </p>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-espresso-400" aria-hidden="true" />
                            <p className="font-medium text-espresso-700">
                              {formatDateShort(sub.nextDeliveryAt)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-0.5">
                            Delivering to
                          </p>
                          <div className="flex items-center gap-1">
                            <Package className="h-3.5 w-3.5 text-espresso-400" aria-hidden="true" />
                            <p className="text-espresso-700 truncate">
                              {sub.address.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section aria-labelledby="past-subs-heading">
              <h2
                id="past-subs-heading"
                className="font-heading font-semibold text-espresso-800 text-lg mb-4"
              >
                Past Subscriptions
              </h2>
              <div className="space-y-3">
                {others.map((sub) => (
                  <Card key={sub.id} padding="md" className="opacity-75">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-espresso-800">{sub.coffee.name}</h3>
                        <p className="text-xs text-espresso-400 mt-0.5">
                          Started {formatDate(sub.startedAt)} •{" "}
                          {sub.tier === "BIWEEKLY" ? "Bi-Weekly" : "Monthly"}
                        </p>
                      </div>
                      <Badge variant={STATUS_BADGE[sub.status] ?? "gray"} size="sm">
                        {sub.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
