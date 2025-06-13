import { describe, expect, it, vi } from "vitest";
import { either } from "./either.js";
import { isEither, isEitherAsync } from "./either.utils.js";

describe("either", () => {
  describe("from try catch", () => {
    it("should get success value", () => {
      const result = either.fromTryCatch(() => 42).resolve(() => 0);
      expect(result).toBe(42);
    });
    it("should get error value", () => {
      const result = either
        .fromTryCatch<string>(() => {
          throw "error";
        })
        .resolve((x) => x as string);
      expect(result).toBe("error");
    });
  });

  describe("from try catch async ", () => {
    it("should get success value", async () => {
      const result = await either.fromTryCatchAsync(async () => 42).resolve(() => 0);
      expect(result).toBe(42);
    });
    it("should get error value", async () => {
      const result = await either
        .fromTryCatchAsync<string>(async () => {
          throw "error";
        })
        .resolve((x) => x as string);
      expect(result).toBe("error");
    });
  });

  describe("mapOnSuccess", () => {
    it("should map", () => {
      const result = either
        .success<string, number>(2)
        .mapOnSuccess((x) => x * 2)
        .resolve(() => 0);

      expect(result).toBe(4);
    });

    it("shouldnot map", () => {
      const result = either
        .error<string, number>("error")
        .mapOnSuccess((x) => x * 4)
        .resolve(() => 0);

      expect(result).toBe(0);
    });

    it("should flatten either", () => {
      const result = either
        .success<string, number>(42)
        .mapOnSuccess((x) => either.success<string, number>(x));
      expect(isEither(result)).toBe(true);
      expect(isEitherAsync(result)).toBe(false);
    });

    it("should flatten either async", () => {
      const result = either
        .success<string, number>(42)
        .mapOnSuccess((x) => either.success<string, number>(x).mapOnSuccessAsync(async (x) => x));
      expect(isEither(result)).toBe(false);
      expect(isEitherAsync(result)).toBe(true);
    });
  });

  describe("mapIfError", () => {
    it("should map", () => {
      const result = either
        .error<string, string>("error")
        .mapOnError((error) => error + " mapped")
        .resolve((error) => error);

      expect(result).toBe("error mapped");
    });

    it("shouldnot map", () => {
      const result = either
        .success<string, string>("success")
        .mapOnError((error) => error + " mapped")
        .resolve((error) => error);

      expect(result).toBe("success");
    });
  });

  describe("doOnSuccess", () => {
    it("should execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .success<string, number>(42)
        .doOnSuccess(() => testFn())
        .resolve(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it("shouldnot not execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .error<string, number>("Error")
        .doOnSuccess(() => testFn())
        .resolve(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe("doOnError", () => {
    it("should execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .error<string, number>("Error")
        .doOnError(() => testFn())
        .resolve(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should not not execute fn", () => {
      const testFn = vi.fn();
      const result = either
        .success<string, number>(42)
        .doOnError(() => testFn())
        .resolve(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe("resolve", () => {
    it("should get get success value", () => {
      const result = either.success<string, number>(42).resolve(0);

      expect(result).toBe(42);
    });

    it("should get resolved error value", () => {
      const result = either.error<string, number>("error").resolve(0);

      expect(result).toBe(0);
    });

    it("should get resolved error value from a function", () => {
      const result = either.error<string, number>("error").resolve((error) => error.length);

      expect(result).toBe(5);
    });
  });
});

describe("eitherAsync", () => {
  const eitherAsyncSuccess = either.success<string, number>(42).mapOnSuccessAsync(async (x) => x);
  const eitherAsyncError = either.error<string, number>("error").mapOnErrorAsync(async (x) => x);

  describe("mapOnSuccess", () => {
    it("should map", async () => {
      const result = await eitherAsyncSuccess.mapOnSuccess((x) => x * 2).resolve(() => 0);

      expect(result).toBe(42 * 2);
    });

    it("shouldnot map", async () => {
      const result = await eitherAsyncError.mapOnSuccess((x) => x * 4).resolve(() => 0);

      expect(result).toBe(0);
    });

    it("should flatten either", async () => {
      const fn = vi.fn();
      await eitherAsyncSuccess
        .mapOnSuccess((x) => either.success<string, number>(x))
        .doOnSuccess(fn).toPromise;

      expect(fn).toHaveBeenCalledWith(42);
    });

    it("should flatten eitherAsync", async () => {
      const fn = vi.fn();
      await eitherAsyncSuccess
        .mapOnSuccess((x) => either.success<string, number>(x).mapOnSuccessAsync(async (x) => x))
        .doOnSuccess(fn).toPromise;

      expect(fn).toHaveBeenCalledWith(42);
    });
  });

  describe("mapOnError", () => {
    it("should map", async () => {
      const result = await either
        .error<string, string>("error")
        .mapOnSuccessAsync(async (x) => x) // Convert to eitherAsync
        .mapOnError((error) => error + " mapped")
        .resolve((error) => error);

      expect(result).toBe("error mapped");
    });

    it("shouldnot map", async () => {
      const result = await either
        .success<string, string>("success")
        .mapOnSuccessAsync(async (x) => x) // convert into EitherAsync
        .mapOnError((error) => error + " mapped")
        .resolve((error) => error);

      expect(result).toBe("success");
    });
  });

  describe("doOnSuccess", () => {
    it("should execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncSuccess.doOnSuccess(() => testFn()).resolve(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it("shouldnot not execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncError.doOnSuccess(() => testFn()).resolve(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe("doOnError", () => {
    it("should execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncError.doOnError(() => testFn()).resolve(() => 0);

      expect(testFn).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it("should not not execute fn", async () => {
      const testFn = vi.fn();
      const result = await eitherAsyncSuccess.doOnError(() => testFn()).resolve(() => 0);

      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe("resolve", () => {
    it("should get get success value", async () => {
      const result = await eitherAsyncSuccess.resolve(0);
      expect(result).toBe(42);
    });

    it("should get resolved error value", async () => {
      const result = await eitherAsyncError.resolve(0);
      expect(result).toBe(0);
    });

    it("should get resolved error value from function", async () => {
      const result = await eitherAsyncError.resolve((error) => error.length);
      expect(result).toBe(5);
    });
  });
});
