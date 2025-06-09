import { describe, expect, it, vi } from "vitest";
import { anotherEither } from "./anotherEither.js";
import { isEither, isEitherAsync } from "./anotherEither.utils.js";

describe("either", () => {
  describe("either", () => {
    describe("onSuccess", () => {
      it("should map success value", () => {
        const result = anotherEither
          .success(42)
          .onSuccess((x) => x + 1)
          .resolve(0);
        expect(result).toBe(43);
      });

      it("should return previous value", () => {
        const fn: <T>(x: T) => void = vi.fn();
        const result = anotherEither.success(42).onSuccess(fn).resolve(0);
        expect(result).toBe(42);
        expect(fn).toHaveBeenCalledWith(42);
      });

      it("should flatmap Either", () => {
        const result = anotherEither
          .success(42)
          .onSuccess((x) => anotherEither.success(x.toString()))
          .resolve("0");
        expect(result).toBe("42");
      });

      it("should flatmap EitherAsync", async () => {
        const toEitherAsync = <T>(x: T) => anotherEither.success(x).onSuccessAsync(async (x) => x);
        const $result = anotherEither.success(42).onSuccess(toEitherAsync).resolve(0);
        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe(42);
      });
    });

    describe("onSuccessAsync", () => {
      it("should map success value", async () => {
        const $result = anotherEither
          .success(42)
          .onSuccessAsync(async (x) => x.toString())
          .resolve("0");
        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe("42");
      });

      it("should return previous value", async () => {
        const fn = vi.fn();
        const $result = anotherEither
          .success(42)
          .onSuccessAsync(async (x) => fn(x))
          .resolve(0);

        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe(42);
        expect(fn).toHaveBeenCalledWith(42);
      });

      it("should flatmap Either", async () => {
        const $result = anotherEither
          .success(42)
          .onSuccessAsync(async (x) => anotherEither.success(x.toString()))
          .resolve("0");
        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe("42");
      });

      it("should flatmap EitherAsync", async () => {
        const toEitherAsync = async <T>(x: T) =>
          anotherEither.success(x).onSuccessAsync(async (x) => x);
        const $result = anotherEither.success(42).onSuccessAsync(toEitherAsync).resolve(0);

        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe(42);
      });
    });

    describe("onError", () => {
      it("should map error", () => {
        const result = anotherEither
          .error<string, string>("error message")
          .onError((x) => x + " mapped")
          .resolve((error) => error);
        expect(result).toBe("error message mapped");
      });

      it("should return previous error", () => {
        const fn = vi.fn();
        const result = anotherEither
          .error<string, string>("error message")
          .onError(fn)
          .resolve((error) => error);
        expect(result).toBe("error message");
        expect(fn).toHaveBeenCalledWith("error message");
      });
    });

    describe("onErrorAsync", () => {
      it("should map error", async () => {
        const $result = anotherEither
          .error<string, string>("error message")
          .onErrorAsync(async (x) => x + " mapped")
          .resolve((x) => x);
        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe("error message mapped");
      });

      it("should return previous error", async () => {
        const fn: <T>(x: T) => void = vi.fn();
        const $result = anotherEither
          .error<string, string>("error message")
          .onErrorAsync(async (x) => fn(x))
          .resolve((x) => x);
        expect($result).toBeInstanceOf(Promise);
        expect(await $result).toBe("error message");
        expect(fn).toHaveBeenCalledWith("error message");
      });
    });

    describe("resolve", () => {
      it("should should not resolve", () => {
        const result = anotherEither.success(42).resolve(0);
        expect(result).toBe(42);
      });

      it("should should resolve from default value", () => {
        const result = anotherEither.error<string, number>("error message").resolve(0);
        expect(result).toBe(0);
      });

      it("should should resolve from error", () => {
        const result = anotherEither
          .error<string, number>("error message")
          .resolve((error) => error.length);
        expect(result).toBe(13);
      });
    });

    describe("isSuccess, isError, value", () => {
      it("should be success", () => {
        const result = anotherEither.success(42);
        expect(result.isSuccess).toBeTruthy();
        expect(result.isError).toBeFalsy();
        expect((result as any).value).toBe(42);
        expect((result as any).error).toBe(undefined);
      });

      it("should be error", () => {
        const result = anotherEither.error("error message");
        expect(result.isError).toBeTruthy();
        expect(result.isSuccess).toBeFalsy();
        expect((result as any).error).toBe("error message");
        expect((result as any).value).toBe(undefined);
      });
    });
  });

  describe("eitherAsync", () => {
    const eitherSuccess = anotherEither.success<string, number>(42).onSuccessAsync(async (x) => x);
    const eitherError = anotherEither
      .error<string, string>("error message")
      .onErrorAsync(async (x) => x);

    describe("onSuccess", () => {
      it("should map", async () => {
        const result = await eitherSuccess.onSuccess((x) => x + 1).resolve(0);
        expect(result).toBe(43);
      });

      it("should return previous value", async () => {
        const fn: <T>(x: T) => void = vi.fn();
        const result = await eitherSuccess.onSuccess(fn).resolve(0);
        expect(result).toBe(42);
        expect(fn).toHaveBeenCalledWith(42);
      });

      it("should flat map either", async () => {
        const result = await eitherSuccess
          .onSuccess((x) => anotherEither.success<string, number>(x + 1))
          .resolve(0);
        expect(result).toBe(43);
      });

      it("should flat map either async", async () => {
        const result = await eitherSuccess
          .onSuccess((x) =>
            anotherEither.success<string, number>(x + 1).onSuccessAsync(async (x) => x)
          )
          .resolve(0);
        expect(result).toBe(43);
      });
    });

    describe("onSuccessAsync", () => {
      it("should map", async () => {
        const result = await eitherSuccess.onSuccessAsync(async (x) => x + 1).resolve(0);
        expect(result).toBe(43);
      });

      it("should return previous value", async () => {
        const fn: <T>(x: T) => void = vi.fn();
        const result = await eitherSuccess.onSuccessAsync(async (x) => fn(x)).resolve(0);
        expect(result).toBe(42);
        expect(fn).toHaveBeenCalledWith(42);
      });

      it("should flat map either", async () => {
        const result = await eitherSuccess
          .onSuccessAsync(async (x) => anotherEither.success<string, number>(x + 1))
          .resolve(0);
        expect(result).toBe(43);
      });

      it("should flat map either async", async () => {
        const result = await eitherSuccess
          .onSuccessAsync(async (x) =>
            anotherEither.success<string, number>(x + 1).onSuccessAsync(async (x) => x)
          )
          .resolve(0);
        expect(result).toBe(43);
      });
    });

    describe("onError", () => {
      it("should map", async () => {
        const result = await eitherError.onError((x) => x + " mapped").resolve((x) => x);
        expect(result).toBe("error message mapped");
      });

      it("should return previous error", async () => {
        const fn: <T>(x: T) => void = vi.fn();
        const result = await eitherError.onError(fn).resolve((x) => x);
        expect(result).toBe("error message");
        expect(fn).toHaveBeenCalledWith("error message");
      });
    });

    describe("onErrorAsync", () => {
      it("should map", async () => {
        const result = await eitherError.onErrorAsync(async (x) => x + " mapped").resolve((x) => x);
        expect(result).toBe("error message mapped");
      });

      it("should return previous error", async () => {
        const fn: <T>(x: T) => void = vi.fn();
        const result = await eitherError.onErrorAsync(async (x) => fn(x)).resolve((x) => x);
        expect(result).toBe("error message");
        expect(fn).toHaveBeenCalledWith("error message");
      });
    });

    describe("resolve", () => {
      it("should should not resolve", async () => {
        const result = await eitherSuccess.resolve(0);
        expect(result).toBe(42);
      });

      it("should should resolve from default value", async () => {
        const result = await eitherError.resolve("resolved value");
        expect(result).toBe("resolved value");
      });

      it("should should resolve from error", async () => {
        const result = await eitherError.resolve((error) => error + " resolved");
        expect(result).toBe("error message resolved");
      });
    });

    describe("toPromise", () => {
      it("should return a promise of either", async () => {
        const $result = eitherSuccess.toPromise;
        expect($result).toBeInstanceOf(Promise);
        expect(isEither(await $result)).toBeTruthy();
        expect(isEitherAsync(await $result)).toBeFalsy();
      });
    });
  });

  describe("either utils", () => {
    describe("from try catch", () => {
      it("should get success value", () => {
        const result = anotherEither.fromTryCatch(() => 42).resolve(0);
        expect(result).toBe(42);
      });

      it("should get error value", () => {
        const result = anotherEither
          .fromTryCatch<string>(() => {
            throw "error";
          })
          .resolve((x) => x as string);
        expect(result).toBe("error");
      });
    });

    describe("from try catch async ", () => {
      it("should get success value", async () => {
        const result = await anotherEither.fromTryCatchAsync(async () => 42).resolve(0);
        expect(result).toBe(42);
      });

      it("should get error value", async () => {
        const result = await anotherEither
          .fromTryCatchAsync<string>(async () => {
            throw "error";
          })
          .resolve((x) => x as string);
        expect(result).toBe("error");
      });
    });
  });
});
