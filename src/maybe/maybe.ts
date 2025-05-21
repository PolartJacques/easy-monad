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
    mapIfValue: <A>(fn: (x: T) => A | Maybe<A>): Maybe<A> => {
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

export const maybe = {
  fromValue: <T>(value: T) => createMaybe<T>({ hasValue: true, value }),
  empty: <T>() => createMaybe<T>({ hasValue: false, value: undefined }),
  fromUndefined: <T>(value: T | undefined): Maybe<T> => {
    if (value === undefined) {
      return createMaybe<T>({ hasValue: false, value: undefined });
    }
    return createMaybe({ hasValue: true, value });
  },
  fromNullable: <T>(value: T | null): Maybe<T> => {
    if (value === null) {
      return createMaybe<T>({ hasValue: false, value: undefined });
    }
    return createMaybe({ hasValue: true, value });
  },
} as const;
