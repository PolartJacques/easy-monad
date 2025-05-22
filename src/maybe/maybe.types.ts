/**
 * Represent a value that may or may not be present
 */
export type Maybe<T> = {
  /**
   * Transform the value if any.
   *
   * Alias for map
   */
  mapValue: <A>(fn: (x: T) => A | Maybe<A>) => Maybe<A>; // map and flatmap
  /**
   * Execute a function only if a value is present.
   * Will not update the value. If you want to update the value use mapValueIfAny instead.
   *
   * Alias for tap
   */
  doIfValue: (fn: (x: T) => void) => Maybe<T>; // tap
  /**
   * Execute a function only if a value is NOT present.
   */
  doIfNoValue: (fn: () => void) => Maybe<T>;
  /**
   * Get the value if any. Else return a default value.
   */
  getOrElse: <A>(x: A) => T | A; // getOrElse, toUndefined, toNullable
  /**
   * Whether Maybe has a value or not
   */
  hasValue: boolean;
} & { [key: symbol]: true };
