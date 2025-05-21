import { describe, expect, it, vi } from "vitest";
import { maybe } from "./maybe.js";

describe("maybe", () => {
  describe("MapIfDefined", () => {
    it("should map", () => {
      const result = maybe
        .fromValue(42)
        .mapIfValue((x) => x + 1)
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should auto flatmap", () => {
      const result = maybe
        .fromValue(42)
        .mapIfValue((x) => maybe.fromValue(x + 1))
        .getOrElse(0);

      expect(result).toBe(43);
    });

    it("should not map", () => {
      const result = maybe
        .empty<number>()
        .mapIfValue((x) => x + 1)
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
        .mapIfValue((_x) => maybe.empty()).hasValue;

      expect(hasValue).toBeFalsy();
    });
  });

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
