import { describe, it, expect } from "vitest";
import { ValidationError, ProviderError, isValidationError, isProviderError } from "../src/lib/errors";
import { z } from "zod";

describe("Error types", () => {
  describe("ValidationError", () => {
    it("can be constructed with message", () => {
      const err = new ValidationError("Invalid schema");
      expect(err.message).toBe("Invalid schema");
      expect(err.code).toBe("VALIDATION_ERROR");
      expect(err.name).toBe("ValidationError");
    });

    it("captures zod issues", () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({ name: 123 });
      if (!result.success) {
        const err = new ValidationError("Schema failed", result.error);
        expect(err.issues.length).toBeGreaterThan(0);
        expect(err.issues[0].path).toBeDefined();
        expect(err.issues[0].message).toBeDefined();
      }
    });

    it("captures raw output snippet", () => {
      const longOutput = "a".repeat(5000);
      const err = new ValidationError("Invalid", undefined, longOutput);
      expect(err.rawSnippet).toBe("a".repeat(2000));
      expect(err.rawSnippet.length).toBe(2000);
    });

    it("is detected by isValidationError", () => {
      const err = new ValidationError("Test");
      expect(isValidationError(err)).toBe(true);
      expect(isProviderError(err)).toBe(false);
    });
  });

  describe("ProviderError", () => {
    it("can be constructed with message", () => {
      const err = new ProviderError("Network failed");
      expect(err.message).toBe("Network failed");
      expect(err.code).toBe("PROVIDER_ERROR");
      expect(err.name).toBe("ProviderError");
    });

    it("captures status code", () => {
      const err = new ProviderError("API error", 429, "Rate limited");
      expect(err.status).toBe(429);
      expect(err.details).toBe("Rate limited");
    });

    it("is detected by isProviderError", () => {
      const err = new ProviderError("Test");
      expect(isProviderError(err)).toBe(true);
      expect(isValidationError(err)).toBe(false);
    });
  });

  describe("Type guards", () => {
    it("returns false for plain Error", () => {
      const err = new Error("Plain error");
      expect(isValidationError(err)).toBe(false);
      expect(isProviderError(err)).toBe(false);
    });

    it("returns false for unknown types", () => {
      expect(isValidationError("string")).toBe(false);
      expect(isProviderError(null)).toBe(false);
      expect(isValidationError({})).toBe(false);
    });
  });
});
