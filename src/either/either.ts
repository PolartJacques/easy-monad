import type { Either } from "./either.types.js";
import { __eitherBrand, isEither } from "./either.utils.js";

type EitherError<Error> = { type: "error"; value: Error };
type EitherSuccess<Success> = { type: "success"; value: Success };

const createEither = <Error, Success>({
  type,
  value,
}: EitherError<Error> | EitherSuccess<Success>): Either<Error, Success> => {
  const either: Either<Error, Success> = {
    [__eitherBrand]: true,
    mapIfSuccess: <Success2>(
      fn: (x: Success) => Success2 | Either<Error, Success2>
    ): Either<Error, Success2> => {
      if (type === "error") {
        return either as unknown as Either<Error, Success2>;
      }
      const result = fn(value);
      if (isEither(result)) {
        return result;
      }
      return createEither<Error, Success2>({
        type: "success",
        value: result,
      });
    },
    mapIfError: <Error2>(fn: (x: Error) => Error2): Either<Error2, Success> => {
      if (type === "error") {
        return createEither<Error2, Success>({
          type: "error",
          value: fn(value),
        });
      }
      return either as unknown as Either<Error2, Success>;
    },
    doIfSuccess: (fn: (x: Success) => void): Either<Error, Success> => {
      if (type === "success") {
        fn(value);
      }
      return either;
    },
    doIfError: (fn: (x: Error) => void): Either<Error, Success> => {
      if (type === "error") {
        fn(value);
      }
      return either;
    },
    resolveErrorIfAny: (fn: (x: Error) => Success): Success =>
      type === "success" ? value : fn(value),
  };
  return either;
};

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
