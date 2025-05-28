import { Either } from "./either.types.js";
import { __eitherBrand } from "./either.utils.js";
import { EitherAsync } from "./eitherAsync.types.js";

export function createEitherAsync<Error, Success>(
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
