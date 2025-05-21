export type Maybe<T> = {
  /**
   * use and transform the value if any
   * @param fn the transform function, take as argument the value and return a new value
   * @returns Maybe
   */
  mapIfValue: <A>(fn: (x: T) => A | Maybe<A>) => Maybe<A>; // map and flatmap
  /**
   * execute a function only if a value is present.
   * Will not update the value. If you want to update the value use mapIfValue
   * @param fn the function to execute. Take as argument the value and return nothing
   * @returns Maybe
   */
  doIfValue: (fn: (x: T) => void) => Maybe<T>; // tap
  /**
   * execute a function only if a value is NOT present.
   * @param fn the function to execute.
   * @returns Maybe
   */
  doIfNoValue: (fn: () => void) => Maybe<T>;
  /**
   * Get the value if any. Else return a default value
   * @param x the default value to return if Maybe contain no value
   * @returns the value inside Maybe if any, or the default value
   */
  getOrElse: <A>(x: A) => T | A; // getOrElse, toUndefined, toNullable
  /**
   * whether Maybe has a value or not
   */
  hasValue: boolean;
} & { [key: symbol]: true };
