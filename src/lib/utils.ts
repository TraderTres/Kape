import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LoyaltyTier } from "@/types";
import type { TierConfig } from "@/types";

// ─────────────────────────────────────────────────────────────
// Tailwind class merger
// ─────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────
// Currency formatting (Philippine Peso)
// ─────────────────────────────────────────────────────────────

export function formatPHP(amount: number | string | any): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

// ─────────────────────────────────────────────────────────────
// Points formatting
// ─────────────────────────────────────────────────────────────

export function formatPoints(points: number): string {
  return new Intl.NumberFormat("en-PH").format(points);
}

export function pointsToDiscount(points: number): number {
  // 100 points = ₱10 discount
  return Math.floor(points / 100) * 10;
}

// ─────────────────────────────────────────────────────────────
// Loyalty Tier logic
// ─────────────────────────────────────────────────────────────

export const TIER_CONFIG: Record<LoyaltyTier, TierConfig> = {
  BRONZE: {
    name: "BRONZE",
    label: "Bronze",
    minPoints: 0,
    maxPoints: 499,
    color: "#92400E",
    bgColor: "#FEF3C7",
    borderColor: "#D97706",
    icon: "Coffee",
    discount: 0,
  },
  SILVER: {
    name: "SILVER",
    label: "Silver",
    minPoints: 500,
    maxPoints: 1499,
    color: "#6B7280",
    bgColor: "#F3F4F6",
    borderColor: "#9CA3AF",
    icon: "Award",
    discount: 5,
  },
  GOLD: {
    name: "GOLD",
    label: "Gold",
    minPoints: 1500,
    maxPoints: 3999,
    color: "#D97706",
    bgColor: "#FEF3C7",
    borderColor: "#FBBF24",
    icon: "Star",
    discount: 10,
  },
  PLATINUM: {
    name: "PLATINUM",
    label: "Platinum",
    minPoints: 4000,
    maxPoints: Infinity,
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    borderColor: "#8B5CF6",
    icon: "Crown",
    discount: 15,
  },
};

export function getTierProgressInfo(currentTier: LoyaltyTier) {
  const tiers: LoyaltyTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const currentIndex = tiers.indexOf(currentTier);
  const nextTier = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  return { nextTier };
}

export function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= 4000) return "PLATINUM";
  if (points >= 1500) return "GOLD";
  if (points >= 500) return "SILVER";
  return "BRONZE";
}

export function getNextTierInfo(points: number): {
  nextTier: LoyaltyTier | null;
  pointsNeeded: number;
  progressPercent: number;
} {
  const tier = getTierFromPoints(points);
  const currentConfig = TIER_CONFIG[tier];

  if (tier === "PLATINUM") {
    return { nextTier: null, pointsNeeded: 0, progressPercent: 100 };
  }

  const tiers: LoyaltyTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const nextTier = tiers[tiers.indexOf(tier) + 1] as LoyaltyTier;
  const nextConfig = TIER_CONFIG[nextTier];
  const pointsNeeded = nextConfig.minPoints - points;
  const progressPercent = Math.round(
    ((points - currentConfig.minPoints) /
      (nextConfig.minPoints - currentConfig.minPoints)) *
      100
  );

  return { nextTier, pointsNeeded, progressPercent };
}

// ─────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getNextDeliveryDate(tier: "BIWEEKLY" | "MONTHLY"): Date {
  const now = new Date();
  if (tier === "BIWEEKLY") {
    now.setDate(now.getDate() + 14);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now;
}

// ─────────────────────────────────────────────────────────────
// Slug helpers
// ─────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

// ─────────────────────────────────────────────────────────────
// Origin labels
// ─────────────────────────────────────────────────────────────

export const ORIGIN_LABELS: Record<string, string> = {
  SAGADA: "Sagada, Mountain Province",
  BARAKO: "Batangas, Luzon",
  APO: "Mt. Apo, Davao",
  BENGUET: "Benguet, Cordillera",
  BUKIDNON: "Bukidnon, Mindanao",
  KALINGA: "Kalinga, CAR",
};

export const ROAST_LABELS: Record<string, string> = {
  LIGHT: "Light Roast",
  MEDIUM: "Medium Roast",
  MEDIUM_DARK: "Medium-Dark Roast",
  DARK: "Dark Roast",
};
