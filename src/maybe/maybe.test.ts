import { describe, expect, it, vi } from "vitest";
import { maybe } from "./maybe.js";

describe("maybe", () => {
  describe("from undefined", () => {
    it("should have value", () => {
      const result = maybe.fromUndefined(42);
      expect(result.hasValue).toBeTruthy();
    });

    it("should not have value", () => {
      const result = maybe.fromUndefined(undefined);
      expect(result.hasValue).toBeFalsy();
    });
  });

  describe("from nullable", () => {
    it("should have value", () => {
      const result = maybe.fromUndefined(42);
      expect(result.hasValue).toBeTruthy();
    });

    it("should not have value", () => {
      const result = maybe.fromNullable(null);
      expect(result.hasValue).toBeFalsy();
    });
  });
});

describe("Maybe", () => {
  describe("mapIfDefined", () => {
    it("should map", () => {
      const result = maybe
        .fromValue(42)
        .mapValue((x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should auto flatmap", () => {
      const result = maybe
        .fromValue(42)
        .mapValue((x) => maybe.fromValue(x + 1))
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should not map", () => {
      const result = maybe
        .empty<number>()
        .mapValue((x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(0);
    });
  });

  describe("mapIfDefinedAsync", () => {
    it("should map", async () => {
      const result = await maybe
        .fromValue(42)
        .mapValueAsync(async (x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should auto flatmap", async () => {
      const result = await maybe
        .fromValue(42)
        .mapValueAsync(async (x) => maybe.fromValue(x + 1))
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should not map", async () => {
      const result = await maybe
        .empty<number>()
        .mapValue(async (x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(0);
    });
  });

  describe("doIfDefined", () => {
    it("should execute", () => {
      const fn = vi.fn();
      maybe.fromValue(42).doIfValue((x) => fn(x));
      expect(fn).toHaveBeenCalledWith(42);
    });

    it("should not execute", () => {
      const fn = vi.fn();
      maybe.empty<number>().doIfValue((x) => fn(x));
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("doIfDefinedAsync", () => {
    it("should execute", async () => {
      const fn = vi.fn();
      await maybe
        .fromValue(42)
        .doIfValueAsync(async (x) => fn(x))
        .toPromise();
      expect(fn).toHaveBeenCalledWith(42);
    });

    it("should not execute", async () => {
      const fn = vi.fn();
      await maybe
        .empty<number>()
        .doIfValueAsync(async (x) => fn(x))
        .toPromise();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("doIfNotDefined", () => {
    it("should execute", () => {
      const fn = vi.fn();
      maybe.empty<number>().doIfNoValue(fn);
      expect(fn).toHaveBeenCalledWith();
    });

    it("should not execute", () => {
      const fn = vi.fn();
      maybe.fromValue(42).doIfNoValue(fn);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("doIfNotDefinedAsync", () => {
    it("should execute", async () => {
      const fn = vi.fn();
      await maybe
        .empty<number>()
        .doIfNoValueAsync(async () => fn())
        .toPromise();
      expect(fn).toHaveBeenCalledWith();
    });

    it("should not execute", async () => {
      const fn = vi.fn();
      await maybe
        .fromValue(42)
        .doIfNoValueAsync(async () => fn())
        .toPromise();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("getOrElse", () => {
    it("should get value", () => {
      const result = maybe.fromValue(42).getOrElse(0);
      expect(result).toBe(42);
    });

    it("should get default value", () => {
      const result = maybe.empty<number>().getOrElse(0);
      expect(result).toBe(0);
    });

    it("should mimic toNullable", () => {
      const result = maybe.empty<number>().getOrElse(null);
      expect(result).toBeNull();
    });

    it("should mimic toUndefined", () => {
      const result = maybe.empty<number>().getOrElse(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("hasValue", () => {
    it("should have value", () => {
      const hasValue = maybe.fromValue(42).hasValue;
      expect(hasValue).toBeTruthy();
    });

    it("should not have value", () => {
      const hasValue = maybe.empty().hasValue;
      expect(hasValue).toBeFalsy();
    });

    it("should not have value", () => {
      const hasValue = maybe
        .fromValue(42)
        .mapValue((_x) => maybe.empty()).hasValue;

      expect(hasValue).toBeFalsy();
    });
  });
});

describe("MaybeAsync", () => {
  const maybeAsyncWithValue = maybe.fromValue(42).mapValueAsync(async (x) => x);
  const maybeAsyncWithoutValue = maybe
    .empty<number>()
    .mapValueAsync(async (x) => x);

  describe("mapIfDefined", () => {
    it("should map", async () => {
      const result = await maybeAsyncWithValue
        .mapValue((x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should auto flatmap", async () => {
      const result = await maybeAsyncWithValue
        .mapValue((x) => maybe.fromValue(x + 1))
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should not map", async () => {
      const result = await maybeAsyncWithoutValue
        .mapValue((x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(0);
    });
  });

  describe("mapIfDefinedAsync", () => {
    it("should map", async () => {
      const result = await maybeAsyncWithValue
        .mapValueAsync(async (x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should auto flatmap", async () => {
      const result = await maybeAsyncWithValue
        .mapValueAsync(async (x) => maybe.fromValue(x + 1))
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should not map", async () => {
      const result = await maybeAsyncWithoutValue
        .mapValue(async (x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(0);
    });
  });

  describe("doIfDefined", () => {
    it("should execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithValue.doIfValue((x) => fn(x)).toPromise();
      expect(fn).toHaveBeenCalledWith(42);
    });

    it("should not execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithoutValue.doIfValue((x) => fn(x)).toPromise();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("doIfDefinedAsync", () => {
    it("should execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithValue.doIfValueAsync(async (x) => fn(x)).toPromise();
      expect(fn).toHaveBeenCalledWith(42);
    });

    it("should not execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithoutValue
        .doIfValueAsync(async (x) => fn(x))
        .toPromise();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("doIfNotDefined", () => {
    it("should execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithoutValue.doIfNoValue(fn).toPromise();
      expect(fn).toHaveBeenCalledWith();
    });

    it("should not execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithValue.doIfNoValue(fn).toPromise();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("doIfNotDefinedAsync", () => {
    it("should execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithoutValue
        .doIfNoValueAsync(async () => fn())
        .toPromise();
      expect(fn).toHaveBeenCalledWith();
    });

    it("should not execute", async () => {
      const fn = vi.fn();
      await maybeAsyncWithValue.doIfNoValueAsync(async () => fn()).toPromise();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("getOrElse", () => {
    it("should get value", async () => {
      const result = await maybeAsyncWithValue.getOrElse(0);
      expect(result).toBe(42);
    });

    it("should get default value", async () => {
      const result = await maybeAsyncWithoutValue.getOrElse(0);
      expect(result).toBe(0);
    });

    it("should mimic toNullable", async () => {
      const result = await maybeAsyncWithoutValue.getOrElse(null);
      expect(result).toBeNull();
    });

    it("should mimic toUndefined", async () => {
      const result = await maybeAsyncWithoutValue.getOrElse(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("hasValue", () => {
    it("should have value", async () => {
      const hasValue = await maybeAsyncWithValue.hasValue;
      expect(hasValue).toBeTruthy();
    });

    it("should not have value", async () => {
      const hasValue = await maybeAsyncWithoutValue.hasValue;
      expect(hasValue).toBeFalsy();
    });

    it("should not have value", async () => {
      const hasValue = await maybeAsyncWithValue.mapValue(maybe.empty).hasValue;

      expect(hasValue).toBeFalsy();
    });
  });
});
