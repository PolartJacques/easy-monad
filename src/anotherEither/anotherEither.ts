import { Either, EitherAsync } from "./anotherEither.types.js";
import {
  __eitherAsyncBrand,
  __eitherBrand,
  isEither,
  isEitherAsync,
} from "./anotherEither.utils.js";

type createEitherArgs<E, S> = { type: "success"; value: S } | { type: "error"; value: E };

export function createEither<E, S>({ type, value }: createEitherArgs<E, S>): Either<E, S> {
  const thisEither: Either<E, S> = {
    ...(type === "error"
      ? {
          isError: true,
          isSuccess: false,
          error: value,
        }
      : {
          isError: false,
          isSuccess: true,
          value: value,
        }),

    onSuccess: (<S2, E2 = E>(
      fn: (x: S) => S2 | Either<E2, S2> | EitherAsync<E2, S2> | undefined
    ): Either<E | E2, S2> | EitherAsync<E2, S2> => {
      if (type === "error") {
        return thisEither as unknown as Either<E, S2>;
      }
      const newValue = fn(value);
      if (isEither<E2, S2>(newValue) || isEitherAsync<E2, S2>(newValue)) {
        return newValue;
      }
      if (newValue === undefined) {
        return thisEither as unknown as Either<E, S2>;
      }
      return createEither<E, S2>({ type: "success", value: newValue });
    }) as unknown as Either<E, S>["onSuccess"],

    onSuccessAsync: <S2, E2 = E>(
      fn: (
        x: S
      ) => Promise<S2> | Promise<void> | Promise<Either<E2, S2>> | Promise<EitherAsync<E2, S2>>
    ): EitherAsync<E | E2, S | S2> => {
      if (type === "error") {
        return createEitherAsync<E | E2, S | S2>(
          Promise.resolve(thisEither as unknown as Either<E | E2, S | S2>)
        );
      }
      const $newEither = new Promise<Either<E | E2, S | S2>>(async (resolve) => {
        const newValue = await fn(value);
        if (newValue === undefined) {
          resolve(thisEither as unknown as Either<E | E2, S | S2>);
          return;
        }
        if (isEither(newValue)) {
          resolve(newValue as unknown as Either<E | E2, S | S2>);
          return;
        }
        if (isEitherAsync<E2, S2>(newValue)) {
          resolve((await newValue) as unknown as Either<E | E2, S | S2>);
          return;
        }
        resolve(createEither<E | E2, S | S2>({ type: "success", value: newValue as S2 }));
      });
      return createEitherAsync($newEither);
    },

    onError: <E2>(fn: (x: E) => E2 | undefined): Either<E, S> | Either<E2, S> => {
      if (type === "success") {
        return thisEither;
      }

      const newValue = fn(value);
      if (newValue === undefined) {
        return thisEither;
      }

      return createEither<E2, S>({ type: "error", value: newValue });
    },

    onErrorAsync: <E2>(fn: (x: E) => Promise<E2> | Promise<void>): EitherAsync<E | E2, S> => {
      if (type === "success") {
        return createEitherAsync(Promise.resolve(thisEither));
      }
      const $newEither = new Promise<Either<E | E2, S>>(async (resolve) => {
        const newValue = await fn(value);
        if (newValue === undefined) {
          resolve(thisEither);
          return;
        }
        resolve(createEither<E2, S>({ type: "error", value: newValue }));
      });
      return createEitherAsync($newEither);
    },

    resolve: (x: ((x: E) => S) | S): S => {
      if (type === "success") {
        return value;
      }
      if (typeof x === "function") {
        return (x as (x: E) => S)(value);
      }
      return x;
    },

    [__eitherBrand]: true,
  };
  return thisEither;
}

function createEitherAsync<E, S>($either: Promise<Either<E, S>>): EitherAsync<E, S> {
  const thisEitherAsync: EitherAsync<E, S> = {
    onSuccess: <S2, E2 = E>(
      fn: (x: S) => S2 | Either<E2, S2> | EitherAsync<E2, S2> | undefined
    ): EitherAsync<E | E2, S | S2> => {
      const $newEither = new Promise<Either<E | E2, S | S2>>(async (resolve) => {
        resolve((await $either).onSuccess(fn) as Either<E | E2, S | S2>);
      });
      return createEitherAsync($newEither);
    },

    onSuccessAsync: <S2, E2 = E>(
      fn: (x: S) => Promise<S2 | Either<E2, S2> | EitherAsync<E2, S2> | undefined>
    ): EitherAsync<E | E2, S | S2> => {
      const $newEither = new Promise<Either<E | E2, S | S2>>(async (resolve) => {
        resolve((await (await $either).onSuccessAsync(fn).toPromise) as Either<E | E2, S | S2>);
      });
      return createEitherAsync($newEither);
    },

    onError: <E2>(fn: (x: E) => E2 | undefined): EitherAsync<E | E2, S> => {
      const $newEither = new Promise<Either<E | E2, S>>(async (resolve) => {
        resolve((await $either).onError(fn) as Either<E | E2, S>);
        return;
      });
      return createEitherAsync($newEither);
    },

    onErrorAsync: <E2>(fn: (x: E) => Promise<E2> | Promise<void>): EitherAsync<E | E2, S> => {
      const $newEither = new Promise<Either<E | E2, S>>(async (resolve) => {
        resolve(await (await $either).onErrorAsync(fn as any).toPromise);
      });
      return createEitherAsync($newEither);
    },

    resolve: (x: S | ((x: E) => S)): Promise<S> => {
      return new Promise<S>(async (resolve) => {
        resolve((await $either).resolve(x as any));
      });
    },

    toPromise: $either,

    [__eitherAsyncBrand]: true,
  };
  return thisEitherAsync;
}

/**
 * either utilities
 */
export const anotherEither = {
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
