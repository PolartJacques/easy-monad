import { Either, EitherAsync } from "./either.types.js";
import { __eitherAsyncBrand, __eitherBrand, isEither, isEitherAsync } from "./either.utils.js";

type EitherError<Error> = { type: "error"; value: Error };
type EitherSuccess<Success> = { type: "success"; value: Success };

const createEither = <Error, Success>({
  type,
  value,
}: EitherError<Error> | EitherSuccess<Success>): Either<Error, Success> => {
  const either: Either<Error, Success> = {
    [__eitherBrand]: true,
    mapOnSuccess: (<Error2, Success2>(
      fn: (x: Success) => Success2 | Either<Error2, Success2> | EitherAsync<Error2, Success2>
    ): Either<Error, Success2> | Either<Error2, Success2> | EitherAsync<Error2, Success2> => {
      if (type === "error") {
        return either as unknown as Either<Error, Success2>;
      }
      const result = fn(value);
      if (isEither<Error2, Success2>(result)) {
        return result;
      }
      result;
      if (isEitherAsync<Error2, Success2>(result)) {
        return result;
      }
      result;
      return createEither<Error, Success2>({
        type: "success",
        value: result,
      });
    }) as unknown as Either<Error, Success>["mapOnSuccess"],
    mapOnSuccessAsync: <Error2, Success2>(
      fn: (
        x: Success
      ) => Promise<Success2 | Either<Error2, Success2> | EitherAsync<Error2, Success2>>
    ): EitherAsync<Error | Error2, Success2> => {
      const $newEither = new Promise<Either<Error | Error2, Success2>>(async (resolve) => {
        if (type === "error") {
          return resolve(either as unknown as Either<Error, Success2>);
        }
        const newValue = await fn(value);
        if (isEither<Error2, Success2>(newValue)) {
          return resolve(newValue);
        }
        if (isEitherAsync<Error2, Success2>(newValue)) {
          return resolve(await newValue.toPromise);
        }
        resolve(
          createEither<Error2, Success2>({
            type,
            value: newValue,
          })
        );
      });
      return createEitherAsync($newEither);
    },
    mapOnError: <Error2>(fn: (x: Error) => Error2): Either<Error2, Success> => {
      if (type === "error") {
        return createEither<Error2, Success>({
          type: "error",
          value: fn(value),
        });
      }
      return either as unknown as Either<Error2, Success>;
    },
    mapOnErrorAsync: <Error2>(fn: (x: Error) => Promise<Error2>): EitherAsync<Error2, Success> => {
      const $newEither = new Promise<Either<Error2, Success>>(async (resolve) => {
        if (type === "success") {
          resolve(either as unknown as Either<Error2, Success>);
          return;
        }
        resolve(createEither<Error2, Success>({ type, value: await fn(value) }));
      });
      return createEitherAsync($newEither);
    },
    doOnSuccess: (fn: (x: Success) => void): Either<Error, Success> => {
      if (type === "success") {
        fn(value);
      }
      return either;
    },
    doOnSuccessAsync: (fn: (x: Success) => Promise<void>): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(async (resolve) => {
        if (type === "success") {
          await fn(value);
        }
        resolve(either);
      });
      return createEitherAsync($newEither);
    },
    doOnError: (fn: (x: Error) => void): Either<Error, Success> => {
      if (type === "error") {
        fn(value);
      }
      return either;
    },
    doOnErrorAsync: (fn: (x: Error) => Promise<void>): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(async (resolve) => {
        if (type === "error") {
          await fn(value);
        }
        resolve(either);
      });
      return createEitherAsync($newEither);
    },
    resolve: (x: ((x: Error) => Success) | Success): Success => {
      if (type === "success") {
        return value;
      }
      if (typeof x === "function") {
        return (x as (x: Error) => Success)(value);
      }
      return x;
    },
  };
  return either;
};

function createEitherAsync<Error, Success>(
  $either: Promise<Either<Error, Success>>
): EitherAsync<Error, Success> {
  const eitherAsync: EitherAsync<Error, Success> = {
    [__eitherAsyncBrand]: true,
    mapOnSuccess: <Error2, Success2>(
      fn: (x: Success) => Success2 | Either<Error2, Success2> | EitherAsync<Error2, Success2>
    ): EitherAsync<Error | Error2, Success2> => {
      const $newEither = new Promise<Either<Error | Error2, Success2>>(async (resolve) => {
        const newEither = (await $either).mapOnSuccess(fn) as unknown as
          | Either<Error, Success2>
          | Either<Error2, Success2>
          | EitherAsync<Error2, Success2>;
        if (isEitherAsync<Error2, Success2>(newEither)) {
          return resolve(await newEither.toPromise);
        }
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    mapOnSuccessAsync: <Error2, Success2>(
      fn: (
        x: Success
      ) => Promise<Success2 | Either<Error2, Success2> | EitherAsync<Error2, Success2>>
    ): EitherAsync<Error | Error2, Success2> => {
      const $newEither = new Promise<Either<Error | Error2, Success2>>(async (resolve) => {
        const newEither = (await (await $either).mapOnSuccessAsync(fn)
          .toPromise) as unknown as Either<Error | Error2, Success2>;
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    mapOnError: <Error2>(fn: (x: Error) => Error2): EitherAsync<Error2, Success> => {
      const $newEither = new Promise<Either<Error2, Success>>(async (resolve) => {
        const newEither = (await $either).mapOnError(fn);
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    mapOnErrorAsync: <Error2>(fn: (x: Error) => Promise<Error2>): EitherAsync<Error2, Success> => {
      const $newEither = new Promise<Either<Error2, Success>>(async (resolve) => {
        const newEither = await (await $either).mapOnErrorAsync(fn).toPromise;
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    doOnSuccess: (fn: (x: Success) => void): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(async (resolve) => {
        const newEither = (await $either).doOnSuccess(fn);
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    doOnSuccessAsync: (fn: (x: Success) => Promise<void>): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(async (resolve) => {
        const newEither = await (await $either).doOnSuccessAsync(fn).toPromise;
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    doOnError: (fn: (x: Error) => void): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(async (resolve) => {
        const newEither = (await $either).doOnError(fn);
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    doOnErrorAsync: (fn: (x: Error) => Promise<void>): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(async (resolve) => {
        const newEither = await (await $either).doOnErrorAsync(fn).toPromise;
        resolve(newEither);
      });
      return createEitherAsync($newEither);
    },
    resolve: (x: ((x: Error) => Success) | Success): Promise<Success> => {
      return new Promise<Success>(async (resolve) => {
        const result = (await $either).resolve(x as (x: Error) => Success);
        resolve(result);
      });
    },
    toPromise: $either,
  };
  return eitherAsync;
}

/**
 * either utilities
 */
export const either = {
  /**
   * create an either in success state with a given value
   */
  success: <Error, Success>(value: Success) =>
    createEither<Error, Success>({ type: "success", value }),
  /**
   * create an either in error state with a given error
   */
  error: <Error, Success>(error: Error) =>
    createEither<Error, Success>({ type: "error", value: error }),
  /**
   * Create an either from a function that can throw an exeption.
   * Either get the value or the exeption.
   */
  fromTryCatch: <Success>(fn: () => Success): Either<unknown, Success> => {
    try {
      const value = fn();
      return createEither<unknown, Success>({ type: "success", value });
    } catch (error) {
      return createEither<unknown, Success>({ type: "error", value: error });
    }
  },
  /**
   * Create an either from an asynchrone function that can throw an exeption.
   * Either get the value or the exeption.
   */
  fromTryCatchAsync: <Success>(fn: () => Promise<Success>): EitherAsync<unknown, Success> => {
    const $either = fn()
      .then((value) => createEither<unknown, Success>({ type: "success", value }))
      .catch((error) => createEither<unknown, Success>({ type: "error", value: error }));
    return createEitherAsync<unknown, Success>($either);
  },
} as const;
