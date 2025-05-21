import type { Maybe } from "./maybe.types.js";

export const __maybeBrand = Symbol("maybe");

export const isMaybe = <T>(x: T | Maybe<T>): x is Maybe<T> =>
  typeof x === "object" && x !== null && __maybeBrand in x;
