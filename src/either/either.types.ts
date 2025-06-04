/**
 * Represent an uncertain state, where you can have either a value, or an error
 */
export type Either<Error, Success> = {
  /**
   * Transform the success value of the either, if any.
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapValueIfSuccess: <Success2, Error2 = Error>(
    fn: (x: Success) => Success2 | Either<Error2, Success2>
  ) => Either<Error | Error2, Success2>;
  /**
   * Transform the success value of the either, if any, with an asynchrone operation
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapValueIfSuccessAsync: <Success2, Error2 = Error>(
    fn: (
      x: Success
    ) =>
      | Promise<
          Success2 | Either<Error2, Success2> | EitherAsync<Error2, Success2>
        >
      | EitherAsync<Error2, Success2>
  ) => EitherAsync<Error | Error2, Success2>;
  /**
   * Transform the error if any
   */
  mapValueIfError: <Error2>(
    fn: (x: Error) => Error2
  ) => Either<Error2, Success>;
  /**
   * Transform the error if any, with an asynchrone operation
   */
  mapValueIfErrorAsync: <Error2>(
    fn: (x: Error) => Promise<Error2>
  ) => EitherAsync<Error2, Success>;
  /**
   * Do something with the success value if any, but does not change it.
   * If you want to change the value, use mapValueIfSuccess instead.
   */
  doIfSuccess: (fn: (x: Success) => void) => Either<Error, Success>;
  /**
   * Do something with the success value if any, but does not change it. Handle asynchrone operation.
   * If you want to change the value, use mapValueIfSuccess instead.
   */
  doIfSuccessAsync: (
    fn: (x: Success) => Promise<void>
  ) => EitherAsync<Error, Success>;
  /**
   * Do something with the error if any, but does not change it.
   * If you want to change the error, use mapValueIfError instead.
   */
  doIfError: (fn: (x: Error) => void) => Either<Error, Success>;
  /**
   * Do something with the error if any, but does not change it. Handle asynchrone operation.
   * If you want to change the error, use mapValueIfError instead.
   */
  doIfErrorAsync: (
    fn: (x: Error) => Promise<void>
  ) => EitherAsync<Error, Success>;
  /**
   * Generate a value from an error, or just return a default value
   */
  resolveErrorIfAny: (fn: (x: Error) => Success) => Success;
  /**
   * Generate a value from an error, or just return a default value. Handle asynchrone operation.
   */
  resolveErrorIfAnyAsync: (
    fn: (x: Error) => Promise<Success>
  ) => Promise<Success>;
} & { [key: symbol]: true };

/**
 * An Either monad that handle asynchrone values
 */
export type EitherAsync<Error, Success> = {
  /**
   * Transform the success value of the either, if any.
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapValueIfSuccess: <Success2, Error2 = Error>(
    fn: (x: Success) => Success2 | Either<Error2, Success2>
  ) => EitherAsync<Error | Error2, Success2>;
  /**
   * Transform the success value of the either, if any, with an asynchrone operation
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapValueIfSuccessAsync: <Success2, Error2 = Error>(
    fn: (
      x: Success
    ) =>
      | Promise<
          Success2 | Either<Error2, Success2> | EitherAsync<Error2, Success2>
        >
      | EitherAsync<Error2, Success2>
  ) => EitherAsync<Error | Error2, Success2>;
  /**
   * Transform the error if any
   */
  mapValueIfError: <Error2>(
    fn: (x: Error) => Error2
  ) => EitherAsync<Error2, Success>;
  /**
   * Transform the error if any, with an asynchrone operation
   */
  mapValueIfErrorAsync: <Error2>(
    fn: (x: Error) => Promise<Error2>
  ) => EitherAsync<Error2, Success>;
  /**
   * Do something with the success value if any, but does not change it.
   * If you want to change the value, use mapValueIfSuccess instead.
   */
  doIfSuccess: (fn: (x: Success) => void) => EitherAsync<Error, Success>;
  /**
   * Do something with the success value if any, but does not change it. Handle asynchrone operation.
   * If you want to change the value, use mapValueIfSuccess instead.
   */
  doIfSuccessAsync: (
    fn: (x: Success) => Promise<void>
  ) => EitherAsync<Error, Success>;
  /**
   * Do something with the error if any, but does not change it.
   * If you want to change the error, use mapValueIfError instead.
   */
  doIfError: (fn: (x: Error) => void) => EitherAsync<Error, Success>;
  /**
   * Do something with the error if any, but does not change it. Handle asynchrone operation.
   * If you want to change the error, use mapValueIfError instead.
   */
  doIfErrorAsync: (
    fn: (x: Error) => Promise<void>
  ) => EitherAsync<Error, Success>;
  /**
   * Generate a value from an error, or just return a default value
   */
  resolveErrorIfAny: (fn: (x: Error) => Success) => Promise<Success>;
  /**
   * Generate a value from an error, or just return a default value. Handle asynchrone operation.
   */
  resolveErrorIfAnyAsync: (
    fn: (x: Error) => Promise<Success>
  ) => Promise<Success>;
} & Promise<Either<Error, Success>>;
