// Shared TypeScript types for Kape

import type { 
  User, Coffee, Subscription, Order, LoyaltyTask, UserTask, Address,
  OrderItem, LoyaltyTier, SubscriptionTier
} from "@prisma/client/index";

// ─────────────────────────────────────────────────────────────
// Re-exports from Prisma
// ─────────────────────────────────────────────────────────────

export type { 
  User, Coffee, Subscription, Order, LoyaltyTask, UserTask, Address,
  OrderItem, LoyaltyTier, SubscriptionTier
};

// ─────────────────────────────────────────────────────────────
// Augmented types with relations
// ─────────────────────────────────────────────────────────────

export type UserWithRelations = User & {
  addresses: Address[];
  subscriptions: (Subscription & { coffee: Coffee })[];
  completedTasks: UserTask[];
};

export type CoffeeWithDetails = Coffee & {
  // optional relation data
};

export type SubscriptionWithDetails = Subscription & {
  coffee: Coffee;
  address: Address;
};

export type OrderWithDetails = Order & {
  items: OrderItem[];
  address: Address;
};

// ─────────────────────────────────────────────────────────────
// Loyalty types
// ─────────────────────────────────────────────────────────────

export type LoyaltyTaskWithStatus = LoyaltyTask & {
  isCompleted: boolean;
};

export type LoyaltyData = {
  points: number;
  tier: LoyaltyTier;
  nextTierPoints: number;
  currentTierMin: number;
  tasks: LoyaltyTaskWithStatus[];
  completedCount: number;
};

export type TierConfig = {
  name: LoyaltyTier;
  label: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  discount: number; // percent discount
};

// ─────────────────────────────────────────────────────────────
// Form / Action types
// ─────────────────────────────────────────────────────────────

export type ActionResult<T = void> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

export type CompleteQuestResult = {
  newPoints: number;
  pointsEarned: number;
  newTier: LoyaltyTier;
};

export type CreateSubscriptionInput = {
  coffeeId: string;
  tier: SubscriptionTier;
  addressId?: string;
  newAddress?: {
    label: string;
    street: string;
    barangay: string;
    city: string;
    zipCode: string;
  };
};

// ─────────────────────────────────────────────────────────────
// UI component prop types
// ─────────────────────────────────────────────────────────────

export type CoffeeCardProps = {
  coffee: CoffeeWithDetails;
};

export type QuestCardProps = {
  task: LoyaltyTaskWithStatus;
  onComplete: (taskId: string) => void;
  isPending?: boolean;
};

export type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  color?: "espresso" | "gold" | "green";
  showLabel?: boolean;
  animated?: boolean;
};

export type BadgeProps = {
  variant?: "espresso" | "gold" | "green" | "blue" | "gray";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
};

// ─────────────────────────────────────────────────────────────
// Admin types
// ─────────────────────────────────────────────────────────────

export type AdminMetrics = {
  activeSubscribers: number;
  mrr: number; // Monthly Recurring Revenue in PHP
  totalOrdersThisMonth: number;
  avgPointsPerUser: number;
  subscriberGrowth: number; // percent
  mrrGrowth: number; // percent
};

export type InventoryItem = Coffee & {
  activeSubscriptionCount: number;
};
