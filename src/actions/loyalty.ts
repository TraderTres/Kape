"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTierFromPoints } from "@/lib/utils";
import type { ActionResult, CompleteQuestResult, LoyaltyData, LoyaltyTask } from "@/types";
import { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────────
// Complete a loyalty quest (secure server action)
// ─────────────────────────────────────────────────────────────

export async function completeQuest(
  taskId: string
): Promise<ActionResult<CompleteQuestResult>> {
  try {
    // 1. Auth guard — user must be logged in
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to complete quests." };
    }

    const userId = session.user.id;

    // 2. Verify the task exists and is active
    const task = await prisma.loyaltyTask.findUnique({
      where: { id: taskId, isActive: true },
    });

    if (!task) {
      return { success: false, error: "Quest not found or is no longer active." };
    }

    // 3. Idempotency check — prevent duplicate non-repeatable completions
    if (!task.isRepeatable) {
      const existing = await prisma.userTask.findUnique({
        where: { userId_taskId: { userId, taskId } },
      });
      if (existing) {
        return { success: false, error: "You have already completed this quest." };
      }
    }

    // 4. Atomic transaction: record completion + update points + update tier
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Record task completion
      await tx.userTask.create({
        data: { userId, taskId },
      });

      // Increment user points
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: { increment: task.pointValue },
        },
        select: { loyaltyPoints: true, loyaltyTier: true },
      });

      // Recalculate tier based on new points
      const newTier = getTierFromPoints(updatedUser.loyaltyPoints);

      // Update tier if changed
      if (newTier !== updatedUser.loyaltyTier) {
        await tx.user.update({
          where: { id: userId },
          data: { loyaltyTier: newTier },
        });
      }

      return {
        newPoints: updatedUser.loyaltyPoints,
        pointsEarned: task.pointValue,
        newTier,
      };
    });

    // 5. Revalidate the loyalty dashboard so UI reflects new state
    revalidatePath("/dashboard/loyalty");

    return {
      success: true,
      data: result,
      message: `+${task.pointValue} Kape Points earned!`,
    };
  } catch (error) {
    console.error("[completeQuest] Error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Get loyalty data for current user (server component usage)
// ─────────────────────────────────────────────────────────────

export async function getUserLoyaltyData(): Promise<LoyaltyData | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    const [user, allTasks, completedUserTasks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { loyaltyPoints: true, loyaltyTier: true },
      }),
      prisma.loyaltyTask.findMany({
        where: { isActive: true },
        orderBy: { pointValue: "desc" },
      }),
      prisma.userTask.findMany({
        where: { userId },
        select: { taskId: true },
      }),
    ]);

    if (!user) return null;

    const completedTaskIds = new Set(completedUserTasks.map((t: { taskId: string }) => t.taskId));

    const tasksWithStatus = allTasks.map((task: LoyaltyTask) => ({
      ...task,
      isCompleted: completedTaskIds.has(task.id),
    }));

    // Calculate tier progress
    const { nextTier } = getTierProgressInfo(user.loyaltyTier);

    const TIER_MIN: Record<string, number> = {
      BRONZE: 0,
      SILVER: 500,
      GOLD: 1500,
      PLATINUM: 4000,
    };

    const TIER_MAX: Record<string, number> = {
      BRONZE: 499,
      SILVER: 1499,
      GOLD: 3999,
      PLATINUM: Infinity,
    };

    return {
      points: user.loyaltyPoints,
      tier: user.loyaltyTier,
      nextTierPoints: nextTier ? TIER_MIN[nextTier] : TIER_MIN["PLATINUM"],
      currentTierMin: TIER_MIN[user.loyaltyTier],
      tasks: tasksWithStatus,
      completedCount: completedTaskIds.size,
    };
  } catch (error) {
    console.error("[getUserLoyaltyData] Error:", error);
    return null;
  }
}

function getTierProgressInfo(tier: string): {
  nextTier: string | null;
} {
  const tiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const idx = tiers.indexOf(tier);
  return {
    nextTier: idx < tiers.length - 1 ? tiers[idx + 1] : null,
  };
}
