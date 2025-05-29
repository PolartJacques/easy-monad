import { describe, expect, it, vi } from "vitest";
import { either } from "./either.js";

describe("either", () => {
  describe("from try catch", () => {
    it("should get success value", () => {
      const result = either.fromTryCatch(() => 42).resolveErrorIfAny(() => 0);
      expect(result).toBe(42);
    });
    it("should get error value", () => {
      const result = either
        .fromTryCatch<string>(() => {
          throw "error";
        })
        .resolveErrorIfAny((x) => x as string);
      expect(result).toBe("error");
    });
  });

  describe("from try catch async ", () => {
    it("should get success value", async () => {
      const result = await either
        .fromTryCatchAsync(async () => 42)
        .resolveErrorIfAny(() => 0);
      expect(result).toBe(42);
    });
    it("should get error value", async () => {
      const result = await either
        .fromTryCatchAsync<string>(async () => {
          throw "error";
        })
        .resolveErrorIfAny((x) => x as string);
      expect(result).toBe("error");
    });
  });

  describe("mapIfSuccess", () => {
    it("should map", () => {
      const result = either
        .success<string, number>(2)
        .mapValueIfSuccess((x) => x * 2)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(4);
    });

    it("shouldnot map", () => {
      const result = either
        .error<string, number>("error")
        .mapValueIfSuccess((x) => x * 4)
        .resolveErrorIfAny(() => 0);

      expect(result).toBe(0);
    });
  });

  describe("mapIfError", () => {
    it("should map", () => {
      const result = either
        .error<string, string>("error")
        .mapValueIfError((error) => error + " mapped")
        .resolveErrorIfAny((error) => error);

      expect(result).toBe("error mapped");
    });

    it("shouldnot map", () => {
      const result = either
        .success<string, string>("success")
        .mapValueIfError((error) => error + " mapped")
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

describe("eitherAsync", () => {
  const eitherAsyncSuccess = either
    .success<string, number>(42)
    .mapValueIfSuccessAsync(async (x) => x);
  const eitherAsyncError = either
    .error<string, number>("error")
    .mapValueIfErrorAsync(async (x) => x);

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
