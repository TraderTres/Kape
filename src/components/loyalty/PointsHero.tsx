import { Coffee, Award, Star, Crown } from "lucide-react";
import { cn, TIER_CONFIG, formatPoints, getNextTierInfo } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { LoyaltyTier } from "@prisma/client";

const TIER_ICONS = {
  BRONZE: Coffee,
  SILVER: Award,
  GOLD: Star,
  PLATINUM: Crown,
};

interface PointsHeroProps {
  points: number;
  tier: LoyaltyTier;
}

export function PointsHero({ points, tier }: PointsHeroProps) {
  const config = TIER_CONFIG[tier];
  const { nextTier, pointsNeeded, progressPercent } = getNextTierInfo(points);
  const TierIcon = TIER_ICONS[tier];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-espresso-gradient p-8 text-white">
      {/* Background decoration */}
      <div
        className="absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-10"
        style={{ background: config.color }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-5"
        style={{ background: "#FBBF24" }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Points display */}
        <div>
          <p className="text-espresso-300 text-sm font-medium uppercase tracking-widest mb-1">
            Kape Points Balance
          </p>
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-5xl font-bold text-gold-300 animate-points-pop tabular-nums">
              {formatPoints(points)}
            </span>
            <span className="text-espresso-300 text-lg">pts</span>
          </div>

          {/* Discount value */}
          <p className="mt-2 text-sm text-espresso-300">
            ≈{" "}
            <span className="text-gold-300 font-semibold">
              ₱{Math.floor(points / 100) * 10}
            </span>{" "}
            in checkout discounts
          </p>
        </div>

        {/* Tier badge */}
        <div
          className="flex items-center gap-4 rounded-2xl px-6 py-4"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: `1px solid ${config.color}40`,
          }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: `${config.color}30` }}
          >
            <TierIcon
              className="h-7 w-7"
              style={{ color: config.color }}
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-xs text-espresso-400 uppercase tracking-wider">Current Tier</p>
            <p
              className="font-heading text-xl font-bold"
              style={{ color: config.color }}
            >
              {config.label}
            </p>
            <p className="text-xs text-espresso-400 mt-0.5">
              {config.discount > 0 ? `${config.discount}% tier discount` : "Earn points to unlock discounts"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <div className="relative mt-6">
          <div className="flex justify-between text-xs text-espresso-300 mb-2">
            <span>{config.label}</span>
            <span>
              <span className="text-gold-300 font-semibold">{pointsNeeded.toLocaleString()}</span>{" "}
              pts to {TIER_CONFIG[nextTier].label}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-espresso-800">
            <div
              className="h-full rounded-full bg-gold-gradient transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={points}
              aria-valuemin={0}
              aria-valuemax={TIER_CONFIG[nextTier].minPoints}
              aria-label={`Progress to ${TIER_CONFIG[nextTier].label} tier`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
