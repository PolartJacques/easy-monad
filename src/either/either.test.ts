import { describe, expect, it, vi } from "vitest";
import { either } from "./either.js";

describe("either", () => {
  describe("mapIfSuccess", () => {
    it("should map", () => {
      const result = either
        .success<string, number>(2)
        .mapIfSuccess((x) => x * 2)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(4);
    });

    it("shouldnot map", () => {
      const result = either
        .error<string, number>("error")
        .mapIfSuccess((x) => x * 4)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(0);
    });
  });

  describe("mapIfError", () => {
    it("should map", () => {
      const result = either
        .error<string, string>("error")
        .mapIfError((error) => error + " mapped")
        .resolveErrorIfAny((error) => error);

      expect(result).toBe("error mapped");
    });

    it("shouldnot map", () => {
      const result = either
        .success<string, string>("success")
        .mapIfError((error) => error + " mapped")
        .resolveErrorIfAny((error) => error);

      expect(result).toBe("success");
    });
  });

  describe("doIfSuccess", () => {
    it("should execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .success<string, number>(42)
        .doIfSuccess(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it("shouldnot not execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .error<string, number>("Error")
        .doIfSuccess(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe("doIfError", () => {
    it("should execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .error<string, number>("Error")
        .doIfError(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should not not execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .success<string, number>(42)
        .doIfError(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe("resolveErrorIfAny", () => {
    it("should get get success value", () => {
      const result = either
        .success<string, number>(42)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(42);
    });

    it("should get resolved error value", () => {
      const result = either
        .error<string, number>("error")
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(0);
    });
  });
});
