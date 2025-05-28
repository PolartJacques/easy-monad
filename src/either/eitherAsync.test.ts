import { describe, expect, it, vi } from "vitest";
import { either } from "./either.js";

const eitherAsyncSuccess = either
  .success<string, number>(42)
  .mapValueIfSuccessAsync(async (x) => x);
const eitherAsyncError = either
  .error<string, number>("error")
  .mapValueIfErrorAsync(async (x) => x);

describe("eitherAsync", () => {
  describe("mapIfSuccess", () => {
    it("should map", async () => {
      const result = await eitherAsyncSuccess
        .mapValueIfSuccess((x) => x * 2)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(42 * 2);
    });

    it("shouldnot map", async () => {
      const result = await eitherAsyncError
        .mapValueIfSuccess((x) => x * 4)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(0);
    });
  });

  describe("mapIfError", () => {
    it("should map", async () => {
      const result = await either
        .error<string, string>("error")
        .mapValueIfSuccessAsync(async (x) => x) // Convert to eitherAsync
        .mapValueIfError((error) => error + " mapped")
        .resolveErrorIfAny((error) => error);

      expect(result).toBe("error mapped");
    });

    it("shouldnot map", async () => {
      const result = await either
        .success<string, string>("success")
        .mapValueIfSuccessAsync(async (x) => x) // convert into EitherAsync
        .mapValueIfError((error) => error + " mapped")
        .resolveErrorIfAny((error) => error);

      expect(result).toBe("success");
    });
  });

  describe("doIfSuccess", () => {
    it("should execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncSuccess
        .doIfSuccess(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it("shouldnot not execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncError
        .doIfSuccess(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe("doIfError", () => {
    it("should execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncError
        .doIfError(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should not not execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncSuccess
        .doIfError(() => testFn())
        .resolveErrorIfAny(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe("resolveErrorIfAny", () => {
    it("should get get success value", async () => {
      const result = await eitherAsyncSuccess.resolveErrorIfAny(() => 0);

      expect(result).toBe(42);
    });

    it("should get resolved error value", async () => {
      const result = await eitherAsyncError.resolveErrorIfAny(() => 0);

      expect(result).toBe(0);
    });
  });
});
