/**
 * Represent a value that may or may not be present
 */
export type Maybe<T> = {
  /**
   * Transform the value, if any.
   * If the result of the maping is another Maybe, it will be flatten automatically
   */
  mapValue: <A>(fn: (x: T) => A | Maybe<A>) => Maybe<A>;
  /**
   * transform the value, if any, with an asynchrone operation.
   * If the result of the maping is another Maybe, it will be flatten automatically
   */
  mapValueAsync: <A>(fn: (x: T) => Promise<A | Maybe<A>>) => MaybeAsync<A>;
  /**
   * Execute a function only if a value is present.
   * Will not update the value. If you want to update the value use mapValue instead.
   */
  doIfValue: (fn: (x: T) => void) => Maybe<T>;
  /**
   * Execute an asynchrone function, only if a value is present.
   * Will not update the value. If you want to update the value use mapValueAsync instead.
   */
  doIfValueAsync: (fn: (x: T) => Promise<void>) => MaybeAsync<T>;
  /**
   * Execute a function, only if a value is NOT present.
   */
  doIfNoValue: (fn: () => void) => Maybe<T>;
  /**
   * Execute an asynchrone function, only if a value is NOT present.
   */
  doIfNoValueAsync: (fn: () => Promise<void>) => MaybeAsync<T>;
  /**
   * Get the value if any. Else return a default value.
   */
  getOrElse: <A>(x: A) => T | A;
  /**
   * Whether Maybe has a value or not
   */
  hasValue: boolean;
} & { [key: symbol]: true };

/**
 * An async version of the Maybe monad.
 * Basically a maybe monad, but handle async value and operations
 */
export type MaybeAsync<T> = {
  /**
   * Transform the value, if any.
   * If the result of the maping is another Maybe, it will be flatten automatically
   */
  mapValue: <A>(fn: (x: T) => A | Maybe<A>) => MaybeAsync<A>;
  /**
   * transform the value, if any, with an asynchrone operation.
   * If the result of the maping is another Maybe, it will be flatten automatically
   */
  mapValueAsync: <A>(fn: (x: T) => Promise<A>) => MaybeAsync<A>;
  /**
   * Execute a function only if a value is present.
   * Will not update the value. If you want to update the value use mapValue instead.
   */
  doIfValue: (fn: (x: T) => void) => MaybeAsync<T>;
  /**
   * Execute an asynchrone function, only if a value is present.
   * Will not update the value. If you want to update the value use mapValueAsync instead.
   */
  doIfValueAsync: (fn: (x: T) => Promise<void>) => MaybeAsync<T>;
  /**
   * Execute a function, only if a value is NOT present.
   */
  doIfNoValue: (fn: () => void) => MaybeAsync<T>;
  /**
   * Execute an asynchrone function, only if a value is NOT present.
   */
  doIfNoValueAsync: (fn: () => Promise<void>) => MaybeAsync<T>;
  /**
   * Get the value if any. Else return a default value.
   */
  getOrElse: <A>(x: A) => Promise<T | A>;
  /**
   * convert a MybeAsync to a Pomise of Maybe
   */
  toPromise: () => Promise<Maybe<T>>;
  /**
   * Whether Maybe has a value or not
   */
  hasValue: Promise<boolean>;
} & { [key: symbol]: true };
