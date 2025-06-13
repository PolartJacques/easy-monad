# Either

The Either monad represents a value that can be one of two possibilities:

- A success value.
- An error or failure value.

This makes it perfect for error handling without using exceptions.

> 🧠 Think of it like this:
>
> "Either I got a valid result, or I got an error explaining what went wrong."

## ✅ Basic Usage

```typescript
import { type Either, either } from "easy-monad/either";

function divide(a: number, b: number): Either<string, number> {
  if (b === 0) {
    return either.error("Cannot divide by zero");
  }
  return either.success(a / b);
}

const result = divide(10, 2)
  .mapOnSuccess((value) => value * 2) // multiply by two the result (if any)
  .doOnError((err) => console.error("Oops:", err)) // log the error (if any)
  .resolve(0); // return a default value if error
```

## Documentation

### Creating an Either

```typescript
import { either } from "easy-monad/either";

// create an Either in success state
either.success(42);
// create an Either in error state
either.error("error message");
// wrap the function with a try catch block and convert the result in an either
either.fromTryCatch(myDangerousFunction);
// same as above but for async functions
either.fromTryCatchAsync(myDangerousFunctionAsync);
```

### Either functionalities

**Basics :**

- `mapOnSuccess`: mutate the success value
- `mapOnError`: mutate the error value
- `doOnSuccess`: use the success value without mutating it
- `doOnError`: use the error value without mutating it
- `resolve`: return the success value or a given default value

Example :

```typescript
either
  .success<string, number>(42) // create an either in success state with value 42
  .mapOnSuccess((x) => x + 1) // will increment the value
  .mapOnError((error) => `Error => ${error}`) // will be skiped becasue either is in success state
  .doOnSuccess((x) => console.log(`value is ${x}`)) // will log "value is 43"
  .doOnError(console.error); // will be skiped becasue either is in success state
  .resolve(0); // resolve the Either by providing a default value in case of error
```

**Handling async operation**

All functions above come with an async version of it.

- `mapOnSuccessAsync`
- `mapOnErrorAsync`
- `doOnSuccessAsync`
- `doOnErrorAsync`

There are use to handle async operations, so you can then access to result of the promise.

Example :

```typescript
either
  .success<string, number>(42) // create an either in success state with value 42
  .mapOnSuccessAsync(async (x) => x + 1) // because the lambda function is async, it return a Promise<number>
  .doOnSuccess((x) => console.log(`value is ${x}`)); // here x is a number, not a Promise<number> thanx to the mapOnSuccessAsync above
```

> ⚠️ you will notice that async handlers return EitherAsync and not Either.
> See the difference in EitherAsync section below

## Advanced usage

### EitherAsync

The EitherAsync is basically the promise of an Either, but you can still use it like a classic Either.

### Flatmap

When using mapOnSuccess (or mapOnSuccessAsync), you are doing this =>

`Either<Error, Success>` + `fn(Success) => Success2` = `Either<Error, Success2>`

But if `Success2` is also an Either, you don't want to have an Either in an Either, it will be a complete mess. easy-monad prevent this by automatically flatten the Either, so you have :

`Either<Error, Success>` + `fn(Success) => Either<Error2, Success2>` = `Either<Error | Error2, Success2>`

> ⚠️ since the returned Either can have a different error type, they end up merge in the resulting
> Either (Error | Error2). We recommand to always use the same types for your errors, so you don't
> end up with union types in thoses cases.

### Either immutability

When mapping over an Either, it return a NEW Either, with a different reference.

Lets look at the following example :

```typescript
const myEither = either.success<string, number>(0);
const newEither1 = myEither.mapOnSuccess((x) => x + 5);
const newEither2 = myEither.mapOnSuccess((x) => x + 10);

// newEither1 contain 5
// newEither2 contain 10
// myEither still contain 0
// newEither1 !== myEither
// newEither2 !== myEither
// newEither1 !== newEither2
```

That mean you can safely shared an Either across your application and use it many times, without interference
