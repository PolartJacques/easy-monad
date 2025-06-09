import { Either, EitherAsync } from "./anotherEither.types.js";

export const __eitherBrand = Symbol("either");
export const __eitherAsyncBrand = Symbol("eitherAsync");

export const isEither = <E, S>(x: unknown): x is Either<E, S> =>
  typeof x === "object" && x !== null && __eitherBrand in x;

export const isEitherAsync = <E, S>(x: unknown): x is EitherAsync<E, S> =>
  typeof x === "object" && x !== null && __eitherAsyncBrand in x;
