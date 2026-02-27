import { z } from "zod/v4";

export const upgradePlanSchema = z.object({
  businessId: z.string(),
  newPlanId: z.string(),
});

export const downgradePlanSchema = z.object({
  businessId: z.string(),
  newPlanId: z.string(),
});

export const cancelSubscriptionSchema = z.object({
  businessId: z.string(),
});

export const activateEarlySchema = z.object({
  businessId: z.string(),
});

export type UpgradePlanInput = z.infer<typeof upgradePlanSchema>;
export type DowngradePlanInput = z.infer<typeof downgradePlanSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export type ActivateEarlyInput = z.infer<typeof activateEarlySchema>;
