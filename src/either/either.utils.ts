import { Either } from "./either.types.js";

export const __eitherBrand = Symbol("either");

export const isEither = <Error, Success, T>(
  x: Either<Error, Success> | T
): x is Either<Error, Success> =>
  x !== null && typeof x === "object" && __eitherBrand in x;
