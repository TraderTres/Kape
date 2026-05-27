"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSubscription } from "@/actions/subscription";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Repeat, MapPin, Plus } from "lucide-react";
import type { Address } from "@prisma/client";

import Image from "next/image";
import { formatPHP, ORIGIN_LABELS, ROAST_LABELS } from "@/lib/utils";
import type { Coffee } from "@prisma/client";

const COFFEE_IMAGES: Record<string, string> = {
  SAGADA: "/sagada.png",
  BARAKO: "/barako.png",
  APO: "/apo.png",
  BENGUET: "/sagada.png",
  BUKIDNON: "/apo.png",
  KALINGA: "/barako.png",
};

interface SubscriptionPickerProps {
  coffees: Coffee[];
  addresses: Address[];
  defaultCoffeeId: string;
}

const TIER_OPTIONS = [
  {
    value: "BIWEEKLY" as const,
    label: "Bi-Weekly",
    description: "Fresh beans every 2 weeks",
    icon: Repeat,
    badge: "Most Popular",
  },
  {
    value: "MONTHLY" as const,
    label: "Monthly",
    description: "Delivered once a month",
    icon: Calendar,
    badge: "Great Value",
  },
];

export function SubscriptionPicker({
  coffees,
  addresses,
  defaultCoffeeId,
}: SubscriptionPickerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCoffeeId, setSelectedCoffeeId] = useState(defaultCoffeeId);
  const [selectedTier, setSelectedTier] = useState<"BIWEEKLY" | "MONTHLY">("BIWEEKLY");
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // New address form
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    barangay: "",
    city: "Caloocan",
    zipCode: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAddressId && !showAddressForm) {
      setError("Please select or add a delivery address.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await createSubscription({
        coffeeId: selectedCoffeeId,
        tier: selectedTier,
        addressId: showAddressForm ? undefined : selectedAddressId,
        newAddress: showAddressForm ? newAddress : undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/subscriptions"), 2000);
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-3xl bg-white border border-espresso-100 shadow-card p-10 text-center col-span-full">
        <div className="text-4xl mb-4">☕</div>
        <h3 className="font-heading font-bold text-espresso-900 text-2xl mb-2">
          Subscription Created!
        </h3>
        <p className="text-espresso-500">
          Your first bag is on its way. Redirecting to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Left Column: Coffees */}
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-semibold text-espresso-900 text-xl mb-4">
            Select Your Coffee
          </h2>
          <div className="space-y-3">
            {coffees.map((coffee) => (
              <label
                key={coffee.id}
                className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                  selectedCoffeeId === coffee.id
                    ? "border-espresso-900 bg-espresso-50 ring-1 ring-espresso-900"
                    : "border-espresso-100 bg-white hover:border-espresso-300"
                }`}
                htmlFor={`coffee-${coffee.id}`}
              >
                <input
                  type="radio"
                  id={`coffee-${coffee.id}`}
                  name="coffeeId"
                  value={coffee.id}
                  checked={selectedCoffeeId === coffee.id}
                  onChange={() => setSelectedCoffeeId(coffee.id)}
                  className="sr-only"
                />
                <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={COFFEE_IMAGES[coffee.origin] ?? "/hero-bg.png"}
                    alt={coffee.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-espresso-900">
                    {coffee.name}
                  </p>
                  <p className="text-xs text-espresso-400 truncate">
                    {ORIGIN_LABELS[coffee.origin as keyof typeof ORIGIN_LABELS]} • {ROAST_LABELS[coffee.roastLevel as keyof typeof ROAST_LABELS]}
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    {coffee.flavorNotes.slice(0, 2).map((n) => (
                      <Badge key={n} variant="espresso" size="sm">{n}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading font-bold text-espresso-900">
                    {formatPHP(coffee.pricePerBag)}
                  </p>
                  <p className="text-xs text-espresso-400">/delivery</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Details & Address */}
      <div className="rounded-3xl bg-white border border-espresso-100 shadow-card p-8 space-y-8 self-start">
        <h2 className="font-heading font-bold text-espresso-900 text-2xl">
          Subscription Details
        </h2>

        {/* Tier selection */}
        <div>
          <p className="text-sm font-medium text-espresso-700 mb-3">Delivery Cadence</p>
          <div className="grid grid-cols-2 gap-3">
            {TIER_OPTIONS.map(({ value, label, description, icon: Icon, badge }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedTier(value)}
                id={`tier-${value.toLowerCase()}`}
                className={`relative flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                  selectedTier === value
                    ? "border-espresso-900 bg-espresso-50 ring-1 ring-espresso-900"
                    : "border-espresso-100 hover:border-espresso-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon
                    className={`h-5 w-5 ${
                      selectedTier === value ? "text-espresso-900" : "text-espresso-400"
                    }`}
                    aria-hidden="true"
                  />
                  {selectedTier === value && (
                    <Badge variant="gold" size="sm">
                      {badge}
                    </Badge>
                  )}
                </div>
                <p className="font-heading font-semibold text-espresso-900 text-sm">
                  {label}
                </p>
                <p className="text-xs text-espresso-400">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Address selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-espresso-700">Delivery Address</p>
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-xs text-espresso-600 hover:text-espresso-900 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add new
            </button>
          </div>

          {addresses.length > 0 && !showAddressForm && (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  htmlFor={`addr-${addr.id}`}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-200 ${
                    selectedAddressId === addr.id
                      ? "border-espresso-900 bg-espresso-50"
                      : "border-espresso-100 hover:border-espresso-200"
                  }`}
                >
                  <input
                    type="radio"
                    id={`addr-${addr.id}`}
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-espresso-500" aria-hidden="true" />
                      <span className="text-sm font-medium text-espresso-900">{addr.label}</span>
                      {addr.isDefault && (
                        <Badge variant="espresso" size="sm">Default</Badge>
                      )}
                    </div>
                    <p className="text-xs text-espresso-400 mt-0.5">
                      {addr.street}, {addr.barangay}, {addr.city} {addr.zipCode}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {showAddressForm && (
            <div className="space-y-3 rounded-xl bg-espresso-50 p-4 border border-espresso-100">
              <p className="text-xs font-medium text-espresso-600 uppercase tracking-wider">
                New Address
              </p>
              {[
                { id: "street", label: "Street & House No.", placeholder: "123 Rizal St" },
                { id: "barangay", label: "Barangay", placeholder: "Barangay 1" },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <label htmlFor={`new-${id}`} className="block text-xs font-medium text-espresso-700 mb-1">
                    {label}
                  </label>
                  <input
                    id={`new-${id}`}
                    type="text"
                    required
                    value={newAddress[id as keyof typeof newAddress]}
                    onChange={(e) => setNewAddress((p) => ({ ...p, [id]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-city" className="block text-xs font-medium text-espresso-700 mb-1">City</label>
                  <select
                    id="new-city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                    className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {["Caloocan", "Manila", "Quezon City", "Makati", "Pasig", "Mandaluyong", "Taguig", "Parañaque", "Las Piñas"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-zip" className="block text-xs font-medium text-espresso-700 mb-1">ZIP Code</label>
                  <input
                    id="new-zip"
                    type="text"
                    required
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress((p) => ({ ...p, zipCode: e.target.value }))}
                    placeholder="1400"
                    className="w-full rounded-lg border border-espresso-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          isLoading={isPending}
          id="subscribe-submit-btn"
        >
          {isPending ? "Creating Subscription…" : "Confirm Subscription"}
        </Button>

        <p className="text-xs text-center text-espresso-400">
          Cancel anytime from your dashboard. No hidden fees.
        </p>
      </div>
    </form>
  );
}
