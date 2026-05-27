import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SubscriptionPicker } from "@/components/shop/SubscriptionPicker";
import { Badge } from "@/components/ui/Badge";
import { ORIGIN_LABELS, ROAST_LABELS, formatPHP } from "@/lib/utils";
import { Coffee } from "lucide-react";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Choose your Philippine coffee subscription — bi-weekly or monthly.",
};

const COFFEE_IMAGES: Record<string, string> = {
  SAGADA: "/sagada.png",
  BARAKO: "/barako.png",
  APO: "/apo.png",
  BENGUET: "/sagada.png",
  BUKIDNON: "/apo.png",
  KALINGA: "/barako.png",
};

interface SubscribePageProps {
  searchParams: Promise<{ coffeeId?: string }>;
}

export default async function SubscribePage({ searchParams }: SubscribePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/subscribe");
  }

  const params = await searchParams;
  const coffeeId = params.coffeeId;

  const [coffees, userAddresses] = await Promise.all([
    prisma.coffee.findMany({
      where: { isAvailable: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  const selectedCoffee = coffeeId
    ? coffees.find((c) => c.id === coffeeId) ?? coffees[0]
    : coffees[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <h1 className="font-heading font-bold text-espresso-900 text-4xl mb-2">
          Start Your Subscription
        </h1>
        <p className="text-espresso-500 text-lg">
          Choose your coffee, delivery cadence, and address.
        </p>
      </div>

      {coffees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Coffee className="h-12 w-12 text-espresso-200 mb-3" aria-hidden="true" />
          <h2 className="font-heading font-bold text-espresso-800 text-xl">
            No coffees available
          </h2>
          <p className="text-espresso-500 text-sm mt-1">
            Our beans are being restocked. Check back soon!
          </p>
        </div>
      ) : (
        <SubscriptionPicker
          coffees={coffees}
          addresses={userAddresses}
          defaultCoffeeId={selectedCoffee?.id ?? coffees[0].id}
        />
      )}
    </div>
  );
}
