import { Either, EitherAsync } from "./either.types.js";

export const __eitherBrand = Symbol("either");
export const __eitherAsyncBrand = Symbol("eitherAsync");

export const isEither = <Error, Success>(x: unknown): x is Either<Error, Success> =>
  x !== null && typeof x === "object" && __eitherBrand in x;

export const isEitherAsync = <Error, Success>(x: unknown): x is EitherAsync<Error, Success> =>
  x !== null && typeof x === "object" && __eitherAsyncBrand in x;
