/**
 * Represent an uncertain state, where you can have either a value, or an error
 */
export type Either<Error, Success> = {
  /**
   * Transform the success value of the either, if any.
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapOnSuccess: {
    <Success2, Error2>(fn: (x: Success) => EitherAsync<Error2, Success2>): EitherAsync<
      Error2,
      Success2
    >;
    <Success2, Error2>(fn: (x: Success) => Either<Error2, Success2>): Either<Error2, Success2>;
    <Success2>(fn: (x: Success) => Success2): Either<Error, Success2>;
  };
  /**
   * Transform the success value of the either, if any, with an asynchrone operation
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapOnSuccessAsync: {
    <Success2, Error2>(fn: (x: Success) => Promise<EitherAsync<Error2, Success2>>): EitherAsync<
      Error2,
      Success2
    >;
    <Success2, Error2>(fn: (x: Success) => Promise<Either<Error2, Success2>>): EitherAsync<
      Error2,
      Success2
    >;
    <Success2>(fn: (x: Success) => Promise<Success2>): EitherAsync<Error, Success2>;
  };
  /**
   * Transform the error if any
   */
  mapOnError: <Error2>(fn: (x: Error) => Error2) => Either<Error2, Success>;
  /**
   * Transform the error if any, with an asynchrone operation
   */
  mapOnErrorAsync: <Error2>(fn: (x: Error) => Promise<Error2>) => EitherAsync<Error2, Success>;
  /**
   * Do something with the success value if any, but does not change it.
   */
  doOnSuccess: (fn: (x: Success) => void) => Either<Error, Success>;
  /**
   * Do something with the success value if any, but does not change it. Handle asynchrone operation.
   */
  doOnSuccessAsync: (fn: (x: Success) => Promise<void>) => EitherAsync<Error, Success>;
  /**
   * Do something with the error if any, but does not change it.
   */
  doOnError: (fn: (x: Error) => void) => Either<Error, Success>;
  /**
   * Do something with the error if any, but does not change it. Handle asynchrone operation.
   */
  doOnErrorAsync: (fn: (x: Error) => Promise<void>) => EitherAsync<Error, Success>;
  /**
   * Generate a value from an error, or just return a default value
   */
  resolve: {
    (fn: (x: Error) => Success): Success;
    (x: Success): Success;
  };
  [key: symbol]: true;
};

/**
 * An Either monad that handle asynchrone values
 */
export type EitherAsync<Error, Success> = {
  /**
   * Transform the success value of the either, if any.
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapOnSuccess: {
    <Success2, Error2>(fn: (x: Success) => EitherAsync<Error2, Success2>): EitherAsync<
      Error2,
      Success2
    >;
    <Success2, Error2>(fn: (x: Success) => Either<Error2, Success2>): EitherAsync<Error2, Success2>;
    <Success2>(fn: (x: Success) => Success2): EitherAsync<Error, Success2>;
  };
  /**
   * Transform the success value of the either, if any, with an asynchrone operation
   * If the result of the mapping is another either, it will be flatten atomatically
   */
  mapOnSuccessAsync: {
    <Success2, Error2>(fn: (x: Success) => Promise<EitherAsync<Error2, Success2>>): EitherAsync<
      Error2,
      Success2
    >;
    <Success2, Error2>(fn: (x: Success) => Promise<Either<Error2, Success2>>): EitherAsync<
      Error2,
      Success2
    >;
    <Success2>(fn: (x: Success) => Promise<Success2>): EitherAsync<Error, Success2>;
  };
  /**
   * Transform the error if any
   */
  mapOnError: <Error2>(fn: (x: Error) => Error2) => EitherAsync<Error2, Success>;
  /**
   * Transform the error if any, with an asynchrone operation
   */
  mapOnErrorAsync: <Error2>(fn: (x: Error) => Promise<Error2>) => EitherAsync<Error2, Success>;
  /**
   * Do something with the success value if any, but does not change it.
   */
  doOnSuccess: (fn: (x: Success) => void) => EitherAsync<Error, Success>;
  /**
   * Do something with the success value if any, but does not change it. Handle asynchrone operation.
   */
  doOnSuccessAsync: (fn: (x: Success) => Promise<void>) => EitherAsync<Error, Success>;
  /**
   * Do something with the error if any, but does not change it.
   */
  doOnError: (fn: (x: Error) => void) => EitherAsync<Error, Success>;
  /**
   * Do something with the error if any, but does not change it. Handle asynchrone operation.
   */
  doOnErrorAsync: (fn: (x: Error) => Promise<void>) => EitherAsync<Error, Success>;
  /**
   * Generate a value from an error, or just return a default value
   */
  resolve: {
    (fn: (x: Error) => Success): Promise<Success>;
    (x: Success): Promise<Success>;
  };
  /**
   * return the underneath promise of either
   */
  toPromise: Promise<Either<Error, Success>>;
  [key: symbol]: true;
};
