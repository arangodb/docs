---
layout: default
description: AQL offers some bit interpretation functions for calculations
---
Bit functions
=============

AQL offers some bit interpretation functions for calculations. The following functions are
supported:

BIT_AND()
---------

`BIT_AND(numbersArray) → result``

And-combines the numeric values in *numbersArray* into a single numeric result value.

- **numbersArray** (array): array with numeric input values
- returns **result** (number): and-combined result

The function expects an array with numeric values as its input. The values in the array 
must be numbers, which must not be negative. The maximum supported input number value is 
(2^63) - 1. Input number values outside the allowed range will make the function return
**null** and produce a warning.
Any null values in the input array are ignored.

```js
BIT_AND([1, 4, 8, 16]) // 0
BIT_AND([3, 7, 63]) // 3
BIT_AND([255, 127 null, 63]) // 63
BIT_AND("foo") // null
```

BIT_COUNT()
-----------

`BIT_COUNT(number) → result``

Counts the number of bits set in the input value. 

- **number** (number): array with numeric input values
- returns **result** (number): number of bits set in the input value

The input value must be a number between 0 and (2^63) - 1 (including). The function will 
return null for any other inputs and produce a warning.

```js
BIT_COUNT(0) // 0
BIT_COUNT(255) // 8
BIT_COUNT(69399252256) // 10
BIT_COUNT("foo") // null


BIT_OR()
---------

`BIT_OR(numbersArray) → result``

Or-combines the numeric values in *numbersArray* into a single numeric result value.

- **numbersArray** (array): array with numeric input values
- returns **result** (number): or-combined result

The function expects an array with numeric values as its input. The values in the array 
must be numbers, which must not be negative. The maximum supported input number value is 
(2^63) - 1. Input number values outside the allowed range will make the function return
**null** and produce a warning.
Any null values in the input array are ignored.

```js
BIT_OR([1, 4, 8, 16]) // 29
BIT_OR([3, 7, 63]) // 63
BIT_OR([255, 127 null, 63]) // 255
BIT_OR("foo") // null
```

BIT_XOR()
---------

`BIT_XOR(numbersArray) → result``

Exclusive-or-combines the numeric values in *numbersArray* into a single numeric result value.

- **numbersArray** (array): array with numeric input values
- returns **result** (number): xor-combined result

The function expects an array with numeric values as its input. The values in the array 
must be numbers, which must not be negative. The maximum supported input number value is 
(2^63) - 1. Input number values outside the allowed range will make the function return
**null** and produce a warning.
Any null values in the input array are ignored.

```js
BIT_XOR([1, 4, 8, 16]) // 29
BIT_XOR([3, 7, 63]) // 59
BIT_XOR([255, 127 null, 63]) // 191
BIT_XOR("foo") // null
```
