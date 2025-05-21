[**easy-monad**](../../../README.md)

***

[easy-monad](../../../modules.md) / [maybe/maybe.types](../README.md) / Maybe

# Type Alias: Maybe\<T\>

> **Maybe**\<`T`\> = `object` & `object`

Defined in: maybe/maybe.types.ts:1

## Type declaration

### doIfNoValue()

> **doIfNoValue**: (`fn`) => `Maybe`\<`T`\>

execute a function only if a value is NOT present.

#### Parameters

##### fn

() => `void`

the function to execute.

#### Returns

`Maybe`\<`T`\>

Maybe

### doIfValue()

> **doIfValue**: (`fn`) => `Maybe`\<`T`\>

execute a function only if a value is present.
Will not update the value. If you want to update the value use mapIfValue

#### Parameters

##### fn

(`x`) => `void`

the function to execute. Take as argument the value and return nothing

#### Returns

`Maybe`\<`T`\>

Maybe

### getOrElse()

> **getOrElse**: \<`A`\>(`x`) => `T` \| `A`

Get the value if any. Else return a default value

#### Type Parameters

##### A

`A`

#### Parameters

##### x

`A`

the default value to return if Maybe contain no value

#### Returns

`T` \| `A`

the value inside Maybe if any, or the default value

### hasValue

> **hasValue**: `boolean`

whether Maybe has a value or not

### mapIfValue()

> **mapIfValue**: \<`A`\>(`fn`) => `Maybe`\<`A`\>

use and transform the value if any

#### Type Parameters

##### A

`A`

#### Parameters

##### fn

(`x`) => `A` \| `Maybe`\<`A`\>

the transform function, take as argument the value and return a new value

#### Returns

`Maybe`\<`A`\>

Maybe

## Type Parameters

### T

`T`
