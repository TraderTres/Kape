"use client";

import { useState, useTransition } from "react";
import {
  Users,
  Star,
  Share2,
  MessageSquare,
  ShoppingCart,
  Calendar,
  ClipboardList,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { completeQuest } from "@/actions/loyalty";
import type { LoyaltyTaskWithStatus } from "@/types";
import type { LoyaltyTaskType } from "@prisma/client";

const TASK_ICONS: Record<LoyaltyTaskType, React.ElementType> = {
  REFERRAL: Users,
  REVIEW: MessageSquare,
  SOCIAL_SHARE: Share2,
  PURCHASE: ShoppingCart,
  ANNIVERSARY: Calendar,
  SURVEY: ClipboardList,
};

const TASK_COLORS: Record<LoyaltyTaskType, { bg: string; icon: string; border: string }> = {
  REFERRAL: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
  REVIEW: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  SOCIAL_SHARE: { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-100" },
  PURCHASE: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  ANNIVERSARY: { bg: "bg-gold-50", icon: "text-gold-600", border: "border-gold-100" },
  SURVEY: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-100" },
};

interface QuestCardProps {
  task: LoyaltyTaskWithStatus;
  onComplete: (taskId: string, pointsEarned: number) => void;
}

export function QuestCard({ task, onComplete }: QuestCardProps) {
  const [isPending, startTransition] = useTransition();
  const [localCompleted, setLocalCompleted] = useState(task.isCompleted);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const TaskIcon = TASK_ICONS[task.taskType];
  const colors = TASK_COLORS[task.taskType];
  const isCompleted = localCompleted;

  function handleComplete() {
    if (isCompleted || isPending) return;
    setErrorMsg(null);

    startTransition(async () => {
      const result = await completeQuest(task.id);
      if (result.success) {
        setLocalCompleted(true);
        onComplete(task.id, result.data.pointsEarned);
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white p-5",
        "transition-all duration-200",
        isCompleted
          ? "opacity-70 border-gray-200"
          : [
              "cursor-pointer border-espresso-100 shadow-card",
              "hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.02]",
              colors.border,
            ]
      )}
      aria-label={`Quest: ${task.title}`}
    >
      {/* Completed overlay checkmark */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <CheckCircle
            className="h-5 w-5 text-emerald-500"
            aria-label="Quest completed"
          />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-xl",
          colors.bg
        )}
      >
        <TaskIcon
          className={cn("h-5 w-5", colors.icon)}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-semibold text-espresso-900 text-base leading-snug">
            {task.title}
          </h3>
          {task.isRepeatable && (
            <Badge variant="gold" size="sm">
              Daily
            </Badge>
          )}
        </div>
        <p className="text-sm text-espresso-500 leading-relaxed mb-4">
          {task.description}
        </p>
      </div>

      {/* Points value pill */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5">
          <Star className="h-3.5 w-3.5 text-gold-600 fill-gold-400" aria-hidden="true" />
          <span className="text-xs font-bold text-gold-700">
            +{task.pointValue} pts
          </span>
        </div>

        {isCompleted ? (
          <span className="text-xs text-emerald-600 font-medium">Completed!</span>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleComplete}
            isLoading={isPending}
            aria-label={`Complete quest: ${task.title}`}
            id={`quest-btn-${task.id}`}
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : null}
            Claim
          </Button>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {errorMsg}
        </p>
      )}
    </article>
  );
}
