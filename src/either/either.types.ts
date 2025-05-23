/**
 * Represent an uncertain state, where you can have either a value, or an error
 */
export type Either<Error, Success> = {
  /**
   * Transform the success value of the either, if any.
   * If the result of the mapping is another either, it will be flatten atomatically
   *
   * alias for map and flatMap
   */
  mapValueIfSuccess: <Success2>(
    fn: (x: Success) => Success2 | Either<Error, Success2>
  ) => Either<Error, Success2>; // both map and flatmap
  /**
   * Transform the error if any
   *
   * alias for mapLeft
   */
  mapValueIfError: <Error2>(
    fn: (x: Error) => Error2
  ) => Either<Error2, Success>;
  /**
   * Do something with the success value if any, but does not change it.
   * If you want to change the value, use mapValueIfSuccess instead.
   *
   * alias for tap
   */
  doIfSuccess: (fn: (x: Success) => void) => Either<Error, Success>;
  /**
   * Do something with the error if any, but does not change it.
   * If you want to change the error, use mapValueIfError instead.
   *
   * alias for tapLeft
   */
  doIfError: (fn: (x: Error) => void) => Either<Error, Success>;
  /**
   * Generate a value from an error, or just return a default value
   */
  resolveErrorIfAny: (fn: (x: Error) => Success) => Success;
} & { [key: symbol]: true };
