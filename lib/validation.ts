import { z } from "zod";

export const reservedUsernames = new Set([
  "admin", "api", "auth", "explore", "home", "item", "onboarding", "settings", "support"
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use at least 3 characters")
  .max(24, "Use at most 24 characters")
  .regex(/^[a-z0-9_]+$/, "Use letters, numbers, and underscores only")
  .refine((value) => !reservedUsernames.has(value), "That username is reserved");

export const ratingSchema = z.object({
  score: z.number().min(1).max(10).refine((value) => value * 2 === Math.round(value * 2), "Use half-point steps"),
  note: z.string().trim().max(280).optional(),
  rank: z.number().int().min(1).max(25)
});

export function canAddToCollection(currentCount: number) {
  return currentCount < 25;
}
