[![npm version](https://img.shields.io/npm/v/easy-monad.svg)](https://www.npmjs.com/package/easy-monad)

# Easy-Monad

Write cleaner code by focusing on what should be done rather than how it should be done.

You don't know what monads are ? Or you find them scary ? This lib is for you.

**easy-monad** is a lightweight TypeScript library that provides simplified and beginner-friendly monads. Designed for developers unfamiliar with functional programming, it focuses on **clarity**, **explicit naming**, and **ease of use** without sacrificing the power of monads.

---

## 💡 Why Monads?

Monads are powerful tools from functional programming that help you:

- Chain operations in a clean, readable way.
- Handle errors and optional values without verbose conditionals.
- Write more predictable and composable code.

Used wisely, monads can eliminate boilerplate code around `null` checks, error handling, and control flow.

---

## ⚠️ But... Monads Are Tricky

Despite their usefulness, monads often come with:

- **Abstract terminology** that can feel intimidating.
- **Cryptic method names** like `map`, `flatMap`, `chain`, `bind`, `fold`, ... and other stuff that comes from another dimension
- **Steep learning curves** for developers without a background in functional programming.

These barriers make monads less accessible to many developers.

---

## ✨ Enter `easy-monad`

This library simplifies the experience of working with monads. Here's what makes it different:

- 🧠 **Developer-friendly naming**: Functions are explicitly named to clarify intent.
- 📦 **Zero learning curve**: No need to understand category theory or functional jargon.
- 🚀 **Plug-and-play**: Designed to drop into any TypeScript project.

---

# 📦 Installation

```bash
npm install easy-monad
```

---

# 📖 Documentation

[easy-monad documentation](https://polartjacques.github.io/easy-monad/)

---

# 📚 Monads

## Either

The Either monad represents a value that can be one of two possibilities:

- A success value.
- An error or failure value.

This makes it perfect for error handling without using exceptions.

> 🧠 Think of it like this:
>
> "Either I got a valid result, or I got an error explaining what went wrong."

### ✅ Basic Usage

```typescript
import { either } from "easy-monad/either";

function divide(a: number, b: number): Either<string, number> {
  if (b === 0) {
    return either.error("Cannot divide by zero");
  }
  return either.success(a / b);
}

const result = divide(10, 2)
  .mapIfSuccess((value) => value * 2) // multiply by two the result (if any)
  .doIfError((err) => console.error("Oops:", err)) // log the error (if any)
  .resolveErrorIfAny(() => 0); // return a default value if error
```

## Maybe

The Maybe monad helps you work safely with optional values without worrying about null or undefined.

It represents a value that may or may not be there

> 🧠 Think of it like this:
>
> "Maybe I have a value… maybe I don’t. But I can handle both cases safely."

### ✅ Basic Usage

```typescript
import { maybe } from "easy-monad/maybe";

function getFirstChar(input: string): Maybe<string> {
  const firstChar = input[0]; // string | undefined
  return maybe.fromUndefined(firstChar);
}

getFirstChar("hello world")
  .mapValue((value) => `first char is ${value}`)
  .getOrEsle("there is no first char"); // output : "first char is h"

getFirstChar("")
  .mapValue((value) => `first char is ${value}`) // wont run
  .getOrEsle("there is no first char"); // output : "there is no first char"
```
