import { __eitherAsyncBrand, __eitherBrand } from "./anotherEither.utils.js";

type EitherState<E, S> =
  | { isError: true; isSuccess: false; error: E }
  | { isError: false; isSuccess: true; value: S };

/**
 * Represent an uncertain state, where you can have either a value, or an error
 */
export type Either<E, S> = EitherState<E, S> & {
  /**
   * if success, handle value
   */
  onSuccess: {
    /**
     * automatically flatten the eitherAsync
     */
    <S2, E2 = E>(fn: (x: S) => EitherAsync<E2, S2>): EitherAsync<E2, S2>;
    /**
     * automatically flatten the either
     */
    <S2, E2 = E>(fn: (x: S) => Either<E2, S2>): Either<E2, S2>;
    /**
     * run function without updating the either
     */
    <S2>(fn: (x: S) => void | undefined): Either<E, S>;
    /**
     * map the value of the either (if it is a success value)
     */
    <S2>(fn: (x: S) => S2): Either<E, S2>;
  };
  /**
   * if success, asynchronously handle value
   */
  onSuccessAsync: {
    /**
     * automatically flatten the eitherAsync
     */
    <S2, E2 = E>(fn: (x: S) => Promise<EitherAsync<E2, S2>>): EitherAsync<E2, S2>;
    /**
     * automatically flatten the either
     */
    <S2, E2 = E>(fn: (x: S) => Promise<Either<E2, S2>>): EitherAsync<E2, S2>;
    /**
     * run async function without updating the either
     */
    <S2>(fn: (x: S) => Promise<void | undefined>): EitherAsync<E, S>;
    /**
     * map the value of the either (if it is a success value)
     */
    <S2>(fn: (x: S) => Promise<S2>): EitherAsync<E, S2>;
  };
  /**
   * if error, handle error
   */
  onError: {
    /**
     * run function without updating the either
     */
    (fn: (x: E) => void | undefined): Either<E, S>;
    /**
     * map the error value
     */
    <E2>(fn: (x: E) => E2): Either<E2, S>;
  };
  /**
   * if error, handle error with an async operation
   */
  onErrorAsync: {
    /**
     * run async function without updating the either
     */
    (fn: (x: E) => Promise<void | undefined>): EitherAsync<E, S>;
    /**
     * map the error value with an async function
     */
    <E2>(fn: (x: E) => Promise<E2>): EitherAsync<E2, S>;
  };
  /**
   * resolve the either by providing a success value
   */
  resolve: {
    /**
     * provide a defaut value if the either is in error
     */
    (x: S): S;
    /**
     * provide a default value based on the error
     */
    (fn: (x: E) => S): S;
  };
  [__eitherBrand]: true;
};

/**
 * An Either monad that handle asynchrone values
 */
export type EitherAsync<E, S> = {
  /**
   * if success, handle value
   */
  onSuccess: {
    /**
     * automatically flatten the eitherAsync
     */
    <S2, E2 = E>(fn: (x: S) => EitherAsync<E2, S2>): EitherAsync<E2, S2>;
    /**
     * automatically flatten the either
     */
    <S2, E2 = E>(fn: (x: S) => Either<E2, S2>): EitherAsync<E2, S2>;
    /**
     * run function without updating the either
     */
    <S2>(fn: (x: S) => void | undefined): EitherAsync<E, S>;
    /**
     * map the value of the either (if it is a success value)
     */
    <S2>(fn: (x: S) => S2): EitherAsync<E, S2>;
  };
  /**
   * if success, asynchronously handle value
   */
  onSuccessAsync: {
    /**
     * automatically flatten the eitherAsync
     */
    <S2, E2 = E>(fn: (x: S) => Promise<EitherAsync<E2, S2>>): EitherAsync<E2, S2>;
    /**
     * automatically flatten the either
     */
    <S2, E2 = E>(fn: (x: S) => Promise<Either<E2, S2>>): EitherAsync<E2, S2>;
    /**
     * run async function without updating the either
     */
    <S2>(fn: (x: S) => Promise<void | undefined>): EitherAsync<E, S>;
    /**
     * map the value of the either (if it is a success value)
     */
    <S2>(fn: (x: S) => Promise<S2>): EitherAsync<E, S2>;
  };
  /**
   * if error, handle error
   */
  onError: {
    /**
     * run function without updating the either
     */
    (fn: (x: E) => void | undefined): EitherAsync<E, S>;
    /**
     * map the error value
     */
    <E2>(fn: (x: E) => E2): EitherAsync<E2, S>;
  };
  /**
   * if error, handle error with an async operation
   */
  onErrorAsync: {
    /**
     * run async function without updating the either
     */
    (fn: (x: E) => Promise<void | undefined>): EitherAsync<E, S>;
    /**
     * map the error value with an async function
     */
    <E2>(fn: (x: E) => Promise<E2>): EitherAsync<E2, S>;
  };
  /**
   * resolve the either by providing a success value
   */
  resolve: {
    /**
     * provide a defaut value if the either is in error
     */
    (x: S): Promise<S>;
    /**
     * provide a default value based on the error
     */
    (fn: (x: E) => S): Promise<S>;
  };
  toPromise: Promise<Either<E, S>>;
  [__eitherAsyncBrand]: true;
};
