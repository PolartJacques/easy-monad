import type { Maybe } from "./maybe.types.js";
import { __maybeBrand, isMaybe } from "./maybe.utils.js";

type CreateMaybeProps<T> =
  | {
      hasValue: true;
      value: T;
    }
  | {
      hasValue: false;
      value: undefined;
    };

const createMaybe = <T>({ hasValue, value }: CreateMaybeProps<T>): Maybe<T> => {
  const maybe: Maybe<T> = {
    [__maybeBrand]: true,
    mapValue: <A>(fn: (x: T) => A | Maybe<A>): Maybe<A> => {
      if (!hasValue) {
        return maybe as unknown as Maybe<A>;
      }
      const newValue = fn(value);
      return isMaybe(newValue)
        ? newValue
        : createMaybe({ hasValue: true, value: newValue });
    },
    doIfValue: (fn: (x: T) => void): Maybe<T> => {
      if (hasValue) {
        fn(value);
      }
      return maybe;
    },
    doIfNoValue: (fn: () => void): Maybe<T> => {
      if (!hasValue) {
        fn();
      }
      return maybe;
    },
    getOrElse: <A>(x: A): T | A => {
      return hasValue ? value : x;
    },
    hasValue,
  };
  return maybe;
};

/**
 * Maybe utilities
 */
export const maybe = {
  /**
   * Create a Maybe object with a value inside
   */
  fromValue: <T>(value: T) => createMaybe<T>({ hasValue: true, value }),
  /**
   * Create a Maybe object with no valuie
   */
  empty: <T>() => createMaybe<T>({ hasValue: false, value: undefined }),
  /**
   * Create a Maybe object that will contain the given value if it is defined.
   * Esle the Maybe object will contain no value.
   */
  fromUndefined: <T>(value: T | undefined): Maybe<T> => {
    if (value === undefined) {
      return createMaybe<T>({ hasValue: false, value: undefined });
    }
    return createMaybe({ hasValue: true, value });
  },
  /**
   * Create a Maybe object that will contain the given value if it is not null.
   * Esle the Maybe object will contain no value.
   */
  fromNullable: <T>(value: T | null): Maybe<T> => {
    if (value === null) {
      return createMaybe<T>({ hasValue: false, value: undefined });
    }
    return createMaybe({ hasValue: true, value });
  },
} as const;
