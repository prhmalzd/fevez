import { describe, expect, it } from "vitest";
import { canAddToCollection, ratingSchema, usernameSchema } from "../lib/validation";

describe("username validation", () => {
  it("normalizes safe usernames", () => expect(usernameSchema.parse("  Film_Fan  ")).toBe("film_fan"));
  it("rejects routes and unsafe characters", () => {
    expect(() => usernameSchema.parse("settings")).toThrow();
    expect(() => usernameSchema.parse("film-fan")).toThrow();
  });
});

describe("rating validation", () => {
  it("allows half-point scores", () => expect(ratingSchema.parse({ score: 8.5, note: "Great", rank: 1 }).score).toBe(8.5));
  it("rejects tenths and long notes", () => {
    expect(() => ratingSchema.parse({ score: 8.7, rank: 1 })).toThrow();
    expect(() => ratingSchema.parse({ score: 9, note: "x".repeat(281), rank: 1 })).toThrow();
  });
  it("stops a 26th collection item", () => {
    expect(canAddToCollection(24)).toBe(true);
    expect(canAddToCollection(25)).toBe(false);
  });
});
