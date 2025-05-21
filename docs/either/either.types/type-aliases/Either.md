[**easy-monad**](../../../README.md)

***

[easy-monad](../../../modules.md) / [either/either.types](../README.md) / Either

# Type Alias: Either\<Error, Success\>

> **Either**\<`Error`, `Success`\> = `object` & `object`

Defined in: either/either.types.ts:1

## Type declaration

### doIfError()

> **doIfError**: (`fn`) => `Either`\<`Error`, `Success`\>

do something with the error if any, and return it as is

alias for tapLeft

#### Parameters

##### fn

(`x`) => `void`

whatever

#### Returns

`Either`\<`Error`, `Success`\>

Either

### doIfSuccess()

> **doIfSuccess**: (`fn`) => `Either`\<`Error`, `Success`\>

do something with the successful value if any, and return it as is

alias for tap

#### Parameters

##### fn

(`x`) => `void`

whatever

#### Returns

`Either`\<`Error`, `Success`\>

Either

### mapIfError()

> **mapIfError**: \<`Error2`\>(`fn`) => `Either`\<`Error2`, `Success`\>

use and transform the error if any

alias for mapLeft

#### Type Parameters

##### Error2

`Error2`

#### Parameters

##### fn

(`x`) => `Error2`

the mapping function for the error

#### Returns

`Either`\<`Error2`, `Success`\>

Either

### mapIfSuccess()

> **mapIfSuccess**: \<`Success2`\>(`fn`) => `Either`\<`Error`, `Success2`\>

Use and transform the value if it is in "success" state.
If the result of the mapping is another either, it will be flatten aitomatically

alias for map and flatMap

#### Type Parameters

##### Success2

`Success2`

#### Parameters

##### fn

(`x`) => `Success2` \| `Either`\<`Error`, `Success2`\>

mapping fonction for the successful value

#### Returns

`Either`\<`Error`, `Success2`\>

Either

### resolveErrorIfAny()

> **resolveErrorIfAny**: (`fn`) => `Success`

Generate a successful response from an error, or just return a default value

#### Parameters

##### fn

(`x`) => `Success`

#### Returns

`Success`

## Type Parameters

### Error

`Error`

### Success

`Success`
