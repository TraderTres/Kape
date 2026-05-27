"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNextDeliveryDate } from "@/lib/utils";
import type { ActionResult, CreateSubscriptionInput, SubscriptionWithDetails } from "@/types";

// ─────────────────────────────────────────────────────────────
// Create a new subscription
// ─────────────────────────────────────────────────────────────

export async function createSubscription(
  input: CreateSubscriptionInput
): Promise<ActionResult<SubscriptionWithDetails>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    const { coffeeId, tier, addressId, newAddress } = input;

    // Verify coffee is available
    const coffee = await prisma.coffee.findUnique({
      where: { id: coffeeId, isAvailable: true },
    });
    if (!coffee) {
      return { success: false, error: "Coffee not available." };
    }

    let finalAddressId = addressId;

    if (!finalAddressId && newAddress) {
      const createdAddress = await prisma.address.create({
        data: {
          userId: session.user.id,
          ...newAddress,
        },
      });
      finalAddressId = createdAddress.id;
    } else if (finalAddressId) {
      // Verify address belongs to user
      const address = await prisma.address.findUnique({
        where: { id: finalAddressId, userId: session.user.id },
      });
      if (!address) {
        return { success: false, error: "Invalid delivery address." };
      }
    } else {
      return { success: false, error: "No delivery address provided." };
    }

    const nextDelivery = getNextDeliveryDate(tier);

    const subscription = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          userId: session.user.id,
          coffeeId,
          addressId: finalAddressId,
          tier,
          status: "ACTIVE",
          nextDeliveryAt: nextDelivery,
          priceAtSubscription: coffee.pricePerBag,
        },
        include: { coffee: true, address: true },
      });

      // Create first order
      await tx.order.create({
        data: {
          userId: session.user.id,
          subscriptionId: sub.id,
          addressId: finalAddressId,
          status: "PENDING",
          subtotal: coffee.pricePerBag,
          shippingFee: 0,
          total: coffee.pricePerBag,
          pointsEarned: Math.floor(Number(coffee.pricePerBag) / 10), // 1pt per ₱10
          items: {
            create: {
              coffeeName: coffee.name,
              quantity: 1,
              unitPrice: coffee.pricePerBag,
              subtotal: coffee.pricePerBag,
            },
          },
        },
      });

      // Earn points for new subscription
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          loyaltyPoints: {
            increment: Math.floor(Number(coffee.pricePerBag) / 10),
          },
        },
      });

      return sub;
    });

    revalidatePath("/dashboard/subscriptions");
    revalidatePath("/dashboard/loyalty");

    return { success: true, data: subscription as SubscriptionWithDetails };
  } catch (error) {
    console.error("[createSubscription] Error:", error);
    return { success: false, error: "Failed to create subscription." };
  }
}

// ─────────────────────────────────────────────────────────────
// Cancel a subscription
// ─────────────────────────────────────────────────────────────

export async function cancelSubscription(
  subscriptionId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    // Verify ownership
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, userId: session.user.id },
    });

    if (!subscription) {
      return { success: false, error: "Subscription not found." };
    }

    if (subscription.status === "CANCELLED") {
      return { success: false, error: "Subscription is already cancelled." };
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    revalidatePath("/dashboard/subscriptions");

    return { success: true, data: undefined, message: "Subscription cancelled." };
  } catch (error) {
    console.error("[cancelSubscription] Error:", error);
    return { success: false, error: "Failed to cancel subscription." };
  }
}

// ─────────────────────────────────────────────────────────────
// Get user subscriptions
// ─────────────────────────────────────────────────────────────

export async function getUserSubscriptions(): Promise<SubscriptionWithDetails[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const subs = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: { coffee: true, address: true },
      orderBy: { createdAt: "desc" },
    });

    return subs as SubscriptionWithDetails[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Update subscription delivery address
// ─────────────────────────────────────────────────────────────

export async function updateDeliveryAddress(
  subscriptionId: string,
  addressId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    // Verify both belong to user
    const [sub, address] = await Promise.all([
      prisma.subscription.findUnique({
        where: { id: subscriptionId, userId: session.user.id },
      }),
      prisma.address.findUnique({
        where: { id: addressId, userId: session.user.id },
      }),
    ]);

    if (!sub) return { success: false, error: "Subscription not found." };
    if (!address) return { success: false, error: "Address not found." };

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { addressId },
    });

    revalidatePath("/dashboard/subscriptions");

    return {
      success: true,
      data: undefined,
      message: "Delivery address updated.",
    };
  } catch (error) {
    console.error("[updateDeliveryAddress] Error:", error);
    return { success: false, error: "Failed to update address." };
  }
}
