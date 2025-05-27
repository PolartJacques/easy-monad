import type { Maybe, MaybeAsync } from "./maybe.types.js";
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

function createMaybe<T>({ hasValue, value }: CreateMaybeProps<T>): Maybe<T> {
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
    mapValueAsync: <A>(fn: (x: T) => Promise<A | Maybe<A>>): MaybeAsync<A> => {
      if (!hasValue) {
        return createMaybeAsync(Promise.resolve(maybe as unknown as Maybe<A>));
      }

      const $newMaybe = new Promise<Maybe<A>>(async (resolve) => {
        const newValue = await fn(value);
        if (isMaybe(newValue)) {
          resolve(newValue);
        } else {
          resolve(createMaybe({ hasValue, value: newValue }));
        }
      });

      return createMaybeAsync($newMaybe);
    },
    doIfValue: (fn: (x: T) => void): Maybe<T> => {
      if (hasValue) {
        fn(value);
      }
      return maybe;
    },
    doIfValueAsync: (fn: (x: T) => Promise<void>): MaybeAsync<T> => {
      const $newMaybe = new Promise<Maybe<T>>(async (resolve) => {
        if (hasValue) {
          await fn(value);
        }
        resolve(maybe);
      });
      return createMaybeAsync($newMaybe);
    },
    doIfNoValue: (fn: () => void): Maybe<T> => {
      if (!hasValue) {
        fn();
      }
      return maybe;
    },
    doIfNoValueAsync: (fn: () => Promise<void>): MaybeAsync<T> => {
      const $newMaybe = new Promise<Maybe<T>>(async (resolve) => {
        if (!hasValue) {
          await fn();
        }
        resolve(maybe);
      });
      return createMaybeAsync($newMaybe);
    },
    getOrElse: <A>(x: A): T | A => (hasValue ? value : x),
    hasValue,
  };
  return maybe;
}

function createMaybeAsync<T>($maybe: Promise<Maybe<T>>): MaybeAsync<T> {
  const maybeAsync: MaybeAsync<T> = {
    [__maybeBrand]: true,
    mapValue: <A>(fn: (x: T) => A | Maybe<A>): MaybeAsync<A> => {
      const $newMaybe = new Promise<Maybe<A>>(async (resolve) => {
        const newMaybe = (await $maybe).mapValue(fn);
        resolve(newMaybe);
      });
      return createMaybeAsync($newMaybe);
    },
    mapValueAsync: <A>(fn: (x: T) => Promise<A>): MaybeAsync<A> => {
      const $newMaybe = new Promise<Maybe<A>>(async (resolve) => {
        const newMaybeAsync = (await $maybe).mapValueAsync(fn);
        const newMaybe = await newMaybeAsync.toPromise();
        resolve(newMaybe);
      });
      return createMaybeAsync($newMaybe);
    },
    doIfValue: (fn: (x: T) => void): MaybeAsync<T> => {
      const $newMaybe = new Promise<Maybe<T>>(async (resolve) => {
        const newMaybe = (await $maybe).doIfValue(fn);
        resolve(newMaybe);
      });
      return createMaybeAsync($newMaybe);
    },
    doIfValueAsync: (fn: (x: T) => Promise<void>): MaybeAsync<T> => {
      const $newMaybe = new Promise<Maybe<T>>(async (resolve) => {
        const newMaybe = await (await $maybe).doIfValueAsync(fn).toPromise();
        resolve(newMaybe);
      });
      return createMaybeAsync($newMaybe);
    },
    doIfNoValue: (fn: () => void): MaybeAsync<T> => {
      const $newMaybe = new Promise<Maybe<T>>(async (resolve) => {
        const newMaybe = (await $maybe).doIfNoValue(fn);
        resolve(newMaybe);
      });
      return createMaybeAsync($newMaybe);
    },
    doIfNoValueAsync: (fn: () => Promise<void>): MaybeAsync<T> => {
      const $newMaybe = new Promise<Maybe<T>>(async (resolve) => {
        const newMaybe = await (await $maybe).doIfNoValueAsync(fn).toPromise();
        resolve(newMaybe);
      });
      return createMaybeAsync($newMaybe);
    },
    getOrElse: <A>(x: A): Promise<T | A> => {
      return new Promise<T | A>(async (resolve) => {
        const result = (await $maybe).getOrElse(x);
        resolve(result);
      });
    },
    toPromise: () => $maybe,
    hasValue: new Promise<boolean>(async (resolve) =>
      resolve((await $maybe).hasValue)
    ),
  };
  return maybeAsync;
}

/**
 * Maybe utilities
 */
export const maybe = {
  /**
   * Create a Maybe object with a value inside
   */
  fromValue: <T>(value: T) => createMaybe<T>({ hasValue: true, value }),
  /**
   * Create a Maybe object with no value
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
