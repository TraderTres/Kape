"use client";

import { useState, useCallback } from "react";
import { Trophy, Zap } from "lucide-react";
import { QuestCard } from "./QuestCard";
import { PointsHero } from "./PointsHero";
import { Card } from "@/components/ui/Card";
import { formatPoints, pointsToDiscount, getTierFromPoints } from "@/lib/utils";
import type { LoyaltyData } from "@/types";

interface LoyaltyDashboardProps {
  initialData: LoyaltyData;
}

export function LoyaltyDashboard({ initialData }: LoyaltyDashboardProps) {
  const [points, setPoints] = useState(initialData.points);
  const [tier, setTier] = useState(initialData.tier);
  const [tasks, setTasks] = useState(initialData.tasks);
  const [latestEarned, setLatestEarned] = useState<number | null>(null);

  // Called by QuestCard on successful completion (optimistic update)
  const handleQuestComplete = useCallback(
    (taskId: string, pointsEarned: number) => {
      // Update points
      const newPoints = points + pointsEarned;
      setPoints(newPoints);
      setTier(getTierFromPoints(newPoints));
      setLatestEarned(pointsEarned);

      // Mark task as completed locally
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, isCompleted: true } : t
        )
      );

      // Clear the toast after 3 seconds
      setTimeout(() => setLatestEarned(null), 3000);
    },
    [points]
  );

  const availableTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const discount = pointsToDiscount(points);

  return (
    <div className="space-y-8">
      {/* Points earned toast */}
      {latestEarned !== null && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-espresso-900 px-5 py-3.5 text-white shadow-espresso animate-fade-up"
          role="status"
          aria-live="polite"
        >
          <Zap className="h-5 w-5 text-gold-300" aria-hidden="true" />
          <div>
            <p className="font-heading font-semibold text-gold-300">
              +{latestEarned} Kape Points!
            </p>
            <p className="text-xs text-espresso-300">Quest completed 🎉</p>
          </div>
        </div>
      )}

      {/* Hero banner */}
      <PointsHero points={points} tier={tier} />

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md">
          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-1">
            Quests Completed
          </p>
          <p className="font-heading text-3xl font-bold text-espresso-900">
            {completedTasks.length}
          </p>
          <p className="text-xs text-espresso-500 mt-1">
            of {tasks.length} total
          </p>
        </Card>

        <Card padding="md">
          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-1">
            Total Points
          </p>
          <p className="font-heading text-3xl font-bold text-gold-600">
            {formatPoints(points)}
          </p>
          <p className="text-xs text-espresso-500 mt-1">Kape Points</p>
        </Card>

        <Card padding="md" className="bg-espresso-50 border-espresso-200">
          <p className="text-xs text-espresso-500 uppercase tracking-wider mb-1">
            Redeemable Discount
          </p>
          <p className="font-heading text-3xl font-bold text-espresso-900">
            ₱{discount}
          </p>
          <p className="text-xs text-espresso-500 mt-1">
            Apply at checkout
          </p>
        </Card>
      </div>

      {/* Available quests */}
      <section aria-labelledby="available-quests-heading">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2
              id="available-quests-heading"
              className="font-heading font-bold text-espresso-900 text-xl"
            >
              Available Quests
            </h2>
            <p className="text-sm text-espresso-500 mt-0.5">
              Complete quests to earn Kape Points
            </p>
          </div>
          {availableTasks.length > 0 && (
            <span className="text-sm font-medium text-espresso-600">
              {availableTasks.length} remaining
            </span>
          )}
        </div>

        {availableTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableTasks.map((task) => (
              <QuestCard
                key={task.id}
                task={task}
                onComplete={handleQuestComplete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-espresso-200 py-16 text-center">
            <Trophy
              className="h-12 w-12 text-gold-400 mb-3"
              aria-hidden="true"
            />
            <h3 className="font-heading font-semibold text-espresso-800 text-lg">
              All quests completed!
            </h3>
            <p className="text-sm text-espresso-500 mt-1 max-w-xs">
              You&apos;ve mastered every quest. New quests drop every week — check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Completed quests */}
      {completedTasks.length > 0 && (
        <section aria-labelledby="completed-quests-heading">
          <h2
            id="completed-quests-heading"
            className="font-heading font-bold text-espresso-900 text-xl mb-5"
          >
            Completed Quests
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <QuestCard
                key={task.id}
                task={task}
                onComplete={handleQuestComplete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
