export type Either<Error, Success> = {
  /**
   * Use and transform the value if it is in "success" state.
   * If the result of the mapping is another either, it will be flatten aitomatically
   *
   * alias for map and flatMap
   * @param fn mapping fonction for the successful value
   * @returns Either
   */
  mapIfSuccess: <Success2>(
    fn: (x: Success) => Success2 | Either<Error, Success2>
  ) => Either<Error, Success2>; // both map and flatmap
  /**
   * use and transform the error if any
   *
   * alias for mapLeft
   * @param fn the mapping function for the error
   * @returns Either
   */
  mapIfError: <Error2>(fn: (x: Error) => Error2) => Either<Error2, Success>;
  /**
   * do something with the successful value if any, and return it as is
   *
   * alias for tap
   * @param fn whatever
   * @returns Either
   */
  doIfSuccess: (fn: (x: Success) => void) => Either<Error, Success>;
  /**
   * do something with the error if any, and return it as is
   *
   * alias for tapLeft
   * @param fn whatever
   * @returns Either
   */
  doIfError: (fn: (x: Error) => void) => Either<Error, Success>;
  /**
   * Generate a successful response from an error, or just return a default value
   *
   * @param fn
   * @returns
   */
  resolveErrorIfAny: (fn: (x: Error) => Success) => Success;
} & { [key: symbol]: true };
