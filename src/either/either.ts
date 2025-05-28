import { Either, EitherAsync } from "./either.types.js";
import { __eitherBrand, isEither } from "./either.utils.js";

type EitherError<Error> = { type: "error"; value: Error };
type EitherSuccess<Success> = { type: "success"; value: Success };

const createEither = <Error, Success>({
  type,
  value,
}: EitherError<Error> | EitherSuccess<Success>): Either<Error, Success> => {
  const either: Either<Error, Success> = {
    [__eitherBrand]: true,
    mapValueIfSuccess: <Success2, Error2>(
      fn: (x: Success) => Success2 | Either<Error2, Success2>
    ): Either<Error | Error2, Success2> => {
      if (type === "error") {
        return either as unknown as Either<Error, Success2>;
      }
      const result = fn(value);
      if (isEither(result)) {
        return result;
      }
      return createEither<Error | Error2, Success2>({
        type: "success",
        value: result,
      });
    },
    mapValueIfSuccessAsync: <Error2, Success2>(
      fn: (x: Success) => Promise<Success2 | Either<Error2, Success2>>
    ): EitherAsync<Error | Error2, Success2> => {
      const $newEither = new Promise<Either<Error | Error2, Success2>>(
        async (resolve) => {
          if (type === "error") {
            resolve(either as unknown as Either<Error | Error2, Success2>);
            return;
          }
          const newValue = await fn(value);
          if (isEither(newValue)) {
            resolve(newValue as unknown as Either<Error | Error2, Success2>);
            return;
          }
          resolve(
            createEither<Error | Error2, Success2>({
              type,
              value: newValue,
            })
          );
        }
      );
      return createEitherAsync($newEither);
    },
    mapValueIfError: <Error2>(
      fn: (x: Error) => Error2
    ): Either<Error2, Success> => {
      if (type === "error") {
        return createEither<Error2, Success>({
          type: "error",
          value: fn(value),
        });
      }
      return either as unknown as Either<Error2, Success>;
    },
    mapValueIfErrorAsync: <Error2>(
      fn: (x: Error) => Promise<Error2>
    ): EitherAsync<Error2, Success> => {
      const $newEither = new Promise<Either<Error2, Success>>(
        async (resolve) => {
          if (type === "success") {
            resolve(either as unknown as Either<Error2, Success>);
            return;
          }
          resolve(
            createEither<Error2, Success>({ type, value: await fn(value) })
          );
        }
      );
      return createEitherAsync($newEither);
    },
    doIfSuccess: (fn: (x: Success) => void): Either<Error, Success> => {
      if (type === "success") {
        fn(value);
      }
      return either;
    },
    doIfSuccessAsync: (
      fn: (x: Success) => Promise<void>
    ): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(
        async (resolve) => {
          if (type === "success") {
            await fn(value);
          }
          resolve(either);
        }
      );
      return createEitherAsync($newEither);
    },
    doIfError: (fn: (x: Error) => void): Either<Error, Success> => {
      if (type === "error") {
        fn(value);
      }
      return either;
    },
    doIfErrorAsync: (
      fn: (x: Error) => Promise<void>
    ): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(
        async (resolve) => {
          if (type === "error") {
            await fn(value);
          }
          resolve(either);
        }
      );
      return createEitherAsync($newEither);
    },
    resolveErrorIfAny: (fn: (x: Error) => Success): Success =>
      type === "success" ? value : fn(value),
    resolveErrorIfAnyAsync: (
      fn: (x: Error) => Promise<Success>
    ): Promise<Success> => {
      return new Promise<Success>(async (resolve) => {
        if (type === "error") {
          resolve(await fn(value));
          return;
        }
        resolve(value);
      });
    },
  };
  return either;
};

function createEitherAsync<Error, Success>(
  $either: Promise<Either<Error, Success>>
): EitherAsync<Error, Success> {
  const eitherAsync: EitherAsync<Error, Success> = {
    [__eitherBrand]: true,
    mapValueIfSuccess: <Error2, Success2>(
      fn: (x: Success) => Success2 | Either<Error2, Success2>
    ): EitherAsync<Error | Error2, Success2> => {
      const $newEither = new Promise<Either<Error | Error2, Success2>>(
        async (resolve) => {
          const newEither = (await $either).mapValueIfSuccess(fn);
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    mapValueIfSuccessAsync: <Error2, Success2>(
      fn: (x: Success) => Promise<Success2 | Either<Error2, Success2>>
    ): EitherAsync<Error | Error2, Success2> => {
      const $newEither = new Promise<Either<Error | Error2, Success2>>(
        async (resolve) => {
          const newEither = await (await $either).mapValueIfSuccessAsync(fn)
            .toPromise;
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    mapValueIfError: <Error2>(
      fn: (x: Error) => Error2
    ): EitherAsync<Error2, Success> => {
      const $newEither = new Promise<Either<Error2, Success>>(
        async (resolve) => {
          const newEither = (await $either).mapValueIfError(fn);
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    mapValueIfErrorAsync: <Error2>(
      fn: (x: Error) => Promise<Error2>
    ): EitherAsync<Error2, Success> => {
      const $newEither = new Promise<Either<Error2, Success>>(
        async (resolve) => {
          const newEither = await (await $either).mapValueIfErrorAsync(fn)
            .toPromise;
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    doIfSuccess: (fn: (x: Success) => void): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(
        async (resolve) => {
          const newEither = (await $either).doIfSuccess(fn);
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    doIfSuccessAsync: (
      fn: (x: Success) => Promise<void>
    ): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(
        async (resolve) => {
          const newEither = await (await $either).doIfSuccessAsync(fn)
            .toPromise;
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    doIfError: (fn: (x: Error) => void): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(
        async (resolve) => {
          const newEither = (await $either).doIfError(fn);
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    doIfErrorAsync: (
      fn: (x: Error) => Promise<void>
    ): EitherAsync<Error, Success> => {
      const $newEither = new Promise<Either<Error, Success>>(
        async (resolve) => {
          const newEither = (await $either).doIfErrorAsync(fn).toPromise;
          resolve(newEither);
        }
      );
      return createEitherAsync($newEither);
    },
    resolveErrorIfAny: (fn: (x: Error) => Success): Promise<Success> => {
      return new Promise<Success>(async (resolve) => {
        const result = (await $either).resolveErrorIfAny(fn);
        resolve(result);
      });
    },
    resolveErrorIfAnyAsync: (
      fn: (x: Error) => Promise<Success>
    ): Promise<Success> => {
      return new Promise<Success>(async (resolve) => {
        const result = await (await $either).resolveErrorIfAnyAsync(fn);
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
  success: <Error, Value>(value: Value) =>
    createEither<Error, Value>({ type: "success", value }),
  /**
   * create an either in error state with a given error
   */
  error: <Error, Value>(error: Error) =>
    createEither<Error, Value>({ type: "error", value: error }),
} as const;
