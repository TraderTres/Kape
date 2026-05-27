import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrderHistory } from "@/actions/orders";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPHP, formatDate } from "@/lib/utils";
import { ShoppingBag, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Order History",
};

const STATUS_VARIANT: Record<string, "green" | "gold" | "gray" | "blue"> = {
  DELIVERED: "green",
  SHIPPED: "blue",
  PROCESSING: "gold",
  PENDING: "gold",
  CANCELLED: "gray",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const orders = await getOrderHistory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-espresso-900 text-3xl">
          Order History
        </h1>
        <p className="text-espresso-500 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed
        </p>
      </div>

      {orders.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <ShoppingBag
            className="h-12 w-12 text-espresso-200 mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="font-heading font-bold text-espresso-800 text-xl mb-2">
            No orders yet
          </h2>
          <p className="text-espresso-500 text-sm">
            Your order history will appear here once you have an active subscription.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} padding="lg">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Order info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading font-bold text-espresso-900">
                      #{order.orderNumber.slice(-8).toUpperCase()}
                    </h2>
                    <Badge variant={STATUS_VARIANT[order.status] ?? "gray"}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-espresso-400 mb-3">
                    {formatDate(order.createdAt)}
                  </p>

                  {/* Items */}
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-espresso-700">
                          {item.coffeeName} × {item.quantity}
                        </span>
                        <span className="text-espresso-600">
                          {formatPHP(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-espresso-400">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {order.address.street}, {order.address.barangay},{" "}
                      {order.address.city}
                    </span>
                  </div>
                </div>

                {/* Order total */}
                <div className="shrink-0 text-right">
                  <p className="text-xs text-espresso-400 mb-0.5">Total</p>
                  <p className="font-heading font-bold text-espresso-900 text-xl">
                    {formatPHP(order.total)}
                  </p>
                  {Number(order.discount) > 0 && (
                    <p className="text-xs text-emerald-600">
                      -{formatPHP(order.discount)} discount
                    </p>
                  )}
                  {order.pointsEarned > 0 && (
                    <p className="text-xs text-gold-600 mt-1">
                      +{order.pointsEarned} pts earned
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
