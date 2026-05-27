import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ORIGIN_LABELS, ROAST_LABELS, formatPHP } from "@/lib/utils";
import { ArrowRight, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Beans",
  description: "Browse our collection of premium Philippine single-origin coffee beans.",
};

async function getAllCoffees() {
  return prisma.coffee.findMany({
    where: { isAvailable: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });
}

const COFFEE_IMAGES: Record<string, string> = {
  SAGADA: "/sagada.png",
  BARAKO: "/barako.png",
  APO: "/apo.png",
  BENGUET: "/sagada.png",
  BUKIDNON: "/apo.png",
  KALINGA: "/barako.png",
};

const ROAST_BADGE: Record<string, "espresso" | "gold" | "green" | "blue"> = {
  LIGHT: "green",
  MEDIUM: "gold",
  MEDIUM_DARK: "espresso",
  DARK: "espresso",
};

export default async function ShopPage() {
  const coffees = await getAllCoffees();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-12 text-center">
        <Badge variant="espresso" size="md" className="mb-4">
          <Package className="h-3.5 w-3.5" aria-hidden="true" />
          Single-Origin Collection
        </Badge>
        <h1 className="font-heading font-bold text-espresso-900 text-4xl md:text-5xl mb-4">
          Shop Philippine Coffee
        </h1>
        <p className="text-espresso-500 text-lg max-w-xl mx-auto">
          Every bean sourced directly from farmers across the Philippine archipelago.
        </p>
      </div>

      {/* Coffee grid */}
      {coffees.length === 0 ? (
        <div className="text-center py-24">
          <Package className="h-16 w-16 text-espresso-200 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-heading font-bold text-espresso-700 text-2xl mb-2">
            Coming Soon
          </h2>
          <p className="text-espresso-400">
            Our bean collection is being restocked. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {coffees.map((coffee) => (
            <article
              key={coffee.id}
              className="group rounded-2xl bg-white border border-espresso-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={COFFEE_IMAGES[coffee.origin] ?? "/hero-bg.png"}
                  alt={`${coffee.name} coffee beans`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/40 to-transparent" />
                {coffee.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold">Featured</Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3">
                  <Badge variant={ROAST_BADGE[coffee.roastLevel]}>
                    {ROAST_LABELS[coffee.roastLevel]}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-heading font-bold text-espresso-900 text-xl leading-snug">
                    {coffee.name}
                  </h2>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-heading font-bold text-espresso-900 text-xl">
                      {formatPHP(coffee.pricePerBag)}
                    </p>
                    <p className="text-xs text-espresso-400">
                      per {coffee.bagWeightGrams}g
                    </p>
                  </div>
                </div>

                <p className="text-xs text-espresso-400 mb-3">
                  {ORIGIN_LABELS[coffee.origin]}
                </p>

                <p className="text-sm text-espresso-600 leading-relaxed mb-4 line-clamp-2">
                  {coffee.description}
                </p>

                {/* Flavor notes */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {coffee.flavorNotes.slice(0, 3).map((note) => (
                    <span
                      key={note}
                      className="text-xs px-2.5 py-1 rounded-full bg-espresso-50 text-espresso-600 border border-espresso-100"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      coffee.stockLevel > 50
                        ? "bg-emerald-400"
                        : coffee.stockLevel > 10
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-espresso-400">
                    {coffee.stockLevel > 50
                      ? "In stock"
                      : coffee.stockLevel > 10
                      ? `Only ${coffee.stockLevel} left`
                      : "Almost sold out"}
                  </span>
                </div>

                <Link
                  href={`/subscribe?coffeeId=${coffee.id}`}
                  className="block"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Subscribe
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
