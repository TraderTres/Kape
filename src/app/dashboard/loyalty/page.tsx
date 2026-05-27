import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserLoyaltyData } from "@/actions/loyalty";
import { LoyaltyDashboard } from "@/components/loyalty/LoyaltyDashboard";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Loyalty Quests",
  description: "Complete quests to earn Kape Points and unlock exclusive discounts.",
};

export default async function LoyaltyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard/loyalty");
  }

  const loyaltyData = await getUserLoyaltyData();

  if (!loyaltyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <Star className="h-12 w-12 text-gold-400 mb-4" aria-hidden="true" />
        <h2 className="font-heading font-bold text-espresso-900 text-2xl">
          Something went wrong
        </h2>
        <p className="text-espresso-500 mt-2">
          We couldn&apos;t load your loyalty data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-espresso-900 text-3xl md:text-4xl">
          Loyalty Quests
        </h1>
        <p className="text-espresso-500 mt-2">
          Welcome back, {session.user.name?.split(" ")[0]}! Complete quests to earn Kape Points.
        </p>
      </div>

      <LoyaltyDashboard initialData={loyaltyData} />
    </div>
  );
}
