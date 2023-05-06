---
layout: default
description: AQL offers some bit manipulation and interpretation functions for bitwise arithmetic
title: AQL Bit Functions
---
Bit functions
=============

<small>Introduced in: v3.7.7</small>

AQL offers some bit manipulation and interpretation functions for bitwise
arithmetic.

These functions can operate on numeric integer values in the range between 0
and 4294967295 (2<sup>32</sup> - 1), both included. This allows treating numbers as
bitsets of up to 32 members. Using any of the bit functions on numbers outside
the supported range will make the function return `null` and register a warning.

The value range for the bit functions is conservatively small, so that no
precision loss or rounding errors should occur when the input/output values of
bit functions are passed around or sent over the wire to client applications
with unknown precision number types.

BIT_AND()
---------

`BIT_AND(numbersArray) → result`

And-combines the numeric values in *numbersArray* into a single numeric result
value.

- **numbersArray** (array): array with numeric input values
- returns **result** (number\|null): and-combined result

The function expects an array with numeric values as its input. The values in
the array must be numbers, which must not be negative. The maximum supported
input number value is 2<sup>32</sup> - 1. Input number values outside the allowed
range will make the function return `null` and produce a warning. Any `null`
values in the input array are ignored.

---

`BIT_AND(value1, value2) → result`

If two numbers are passed as individual function parameters to `BIT_AND()`, it
will return the bitwise and value of its two operands. Only numbers in the
range 0 to 2<sup>32</sup> - 1 are allowed as input values.

- **value1** (number): first operand
- **value2** (number): second operand
- returns **result** (number\|null): and-combined result

```aql
BIT_AND([1, 4, 8, 16]) // 0
BIT_AND([3, 7, 63]) // 3
BIT_AND([255, 127, null, 63]) // 63
BIT_AND(127, 255) // 127
BIT_AND("foo") // null
```

BIT_CONSTRUCT()
---------------

`BIT_CONSTRUCT(positionsArray) → result`

Construct a number value with its bits set at the positions given in the array.

- **positionArray** (array): array with bit positions to set (zero-based)
- returns **result** (number\|null): the generated number

The function expects an array with numeric values as its input. The values in
the array must be numbers, which must not be negative. The maximum supported
input number value is 31. Input number values outside the allowed range will
make the function return `null` and produce a warning.

```aql
BIT_CONSTRUCT([1, 2, 3]) // 14
BIT_CONSTRUCT([0, 4, 8]) // 273
BIT_CONSTRUCT([0, 1, 10, 31]) // 2147484675
```

BIT_DECONSTRUCT()
-----------------

`BIT_DECONSTRUCT(number) → positionsArray`

Deconstruct a number value into an array with the positions of its set bits.

- **number** (number): the input value to deconstruct
- returns **positionArray** (array\|null): array with bit positions set (zero-based)

The function turns a numeric value into an array with the positions of all its
set bits. The positions in the output array are zero-based.
The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The function will return `null` for any other inputs and produce a warning.

```aql
BIT_DECONSTRUCT(14) // [1, 2, 3]
BIT_DECONSTRUCT(273) // [0, 4, 8]
BIT_DECONSTRUCT(2147484675) // [0, 1, 10, 31]
```

BIT_FROM_STRING()
-----------------

`BIT_FROM_STRING(bitstring) → number`

Converts a bitstring (consisting of digits `0` and `1`) into a number.

To convert a number into a bitstring, see [BIT_TO_STRING()](#bit_to_string).

- **bitstring** (string): string sequence consisting of `0` and `1` characters
- returns **number** (number\|null): the parsed number

The input value must be a bitstring, consisting only of `0` and `1` characters.
The bitstring can contain up to 32 significant bits, including any leading zeros.
Note that the bitstring must not start with `0b`.
If the bitstring has an invalid format, this function returns `null` and produces
a warning.

```aql
BIT_FROM_STRING("0111") // 7
BIT_FROM_STRING("000000000000010") // 2
BIT_FROM_STRING("11010111011101") // 13789
BIT_FROM_STRING("100000000000000000000") // 1048756
```

BIT_NEGATE()
------------

`BIT_NEGATE(number, bits) → result`

Bitwise-negates the bits in **number**, and keeps up to **bits** bits in the
result.

- **number** (number): the number to negate
- **bits** (number): number of bits to keep in the result (0 to 32)
- returns **result** (number\|null): the resulting number, with up to **bits**
  significant bits

The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The number of bits must be between 0 and 32. The function will return `null` for
any other inputs and produce a warning.

```aql
BIT_NEGATE(0, 8) // 255
BIT_NEGATE(0, 10) // 1023
BIT_NEGATE(3, 4) // 12
BIT_NEGATE(446359921, 32) // 3848607374
```

BIT_OR()
--------

`BIT_OR(numbersArray) → result`

Or-combines the numeric values in *numbersArray* into a single numeric result
value.

- **numbersArray** (array): array with numeric input values
- returns **result** (number\|null): or-combined result

The function expects an array with numeric values as its input. The values in
the array must be numbers, which must not be negative. The maximum supported
input number value is 2<sup>32</sup> - 1. Input number values outside the
allowed range will make the function return `null` and produce a warning.
Any `null` values in the input array are ignored.

---

`BIT_OR(value1, value2) → result`

If two numbers are passed as individual function parameters to `BIT_OR()`, it
will return the bitwise or value of its two operands. Only numbers in the range
0 to 2<sup>32</sup> - 1 are allowed as input values.

- **value1** (number): first operand
- **value2** (number): second operand
- returns **result** (number\|null): or-combined result

```aql
BIT_OR([1, 4, 8, 16]) // 29
BIT_OR([3, 7, 63]) // 63
BIT_OR([255, 127, null, 63]) // 255
BIT_OR(255, 127) // 255
BIT_OR("foo") // null
```

BIT_POPCOUNT()
--------------

`BIT_POPCOUNT(number) → result`

Counts the number of bits set in the input value.

- **number** (number): array with numeric input values
- returns **result** (number\|null): number of bits set in the input value

The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The function will return `null` for any other inputs and produce a warning.

```aql
BIT_POPCOUNT(0) // 0
BIT_POPCOUNT(255) // 8
BIT_POPCOUNT(69399252) // 12
BIT_POPCOUNT("foo") // null
```

BIT_SHIFT_LEFT()
----------------

`BIT_SHIFT_LEFT(number, shift, bits) → result`

Bitwise-shifts the bits in **number** to the left, and keeps up to **bits**
bits in the result. When bits overflow due to the shift, they are discarded.

- **number** (number): the number to shift
- **shift** (number): number of bits to shift (0 to 32)
- **bits** (number): number of bits to keep in the result (0 to 32)
- returns **result** (number\|null): the resulting number, with up to **bits**
  significant bits

The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The number of bits must be between 0 and 32. The function will return `null` for
any other inputs and produce a warning.

```aql
BIT_SHIFT_LEFT(0, 1, 8) // 0
BIT_SHIFT_LEFT(7, 1, 16) // 14
BIT_SHIFT_LEFT(2, 10, 16) // 2048
BIT_SHIFT_LEFT(878836, 16, 32) // 1760821248
```

BIT_SHIFT_RIGHT()
-----------------

`BIT_SHIFT_RIGHT(number, shift, bits) → result`

Bitwise-shifts the bits in **number** to the right, and keeps up to **bits**
bits in the result. When bits overflow due to the shift, they are discarded.

- **number** (number): the number to shift
- **shift** (number): number of bits to shift (0 to 32)
- **bits** (number): number of bits to keep in the result (0 to 32)
- returns **result** (number\|null): the resulting number, with up to **bits**
  significant bits

The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The number of bits must be between 0 and 32. The function will return `null` for
any other inputs and produce a warning.

```aql
BIT_SHIFT_RIGHT(0, 1, 8) // 0
BIT_SHIFT_RIGHT(33, 1, 16) // 16
BIT_SHIFT_RIGHT(65536, 13, 16) // 8
BIT_SHIFT_RIGHT(878836, 4, 32) // 54927
```

BIT_TEST()
----------

`BIT_TEST(number, index) → result`

Tests if the at position *index* is set in **number**.

- **number** (number): the number to test
- **index** (number): index of the bit to test (0 to 31)
- returns **result** (boolean\|null): whether or not the bit was set

The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The **index** must be between 0 and 31. The function will return `null` for any
other inputs and produce a warning.

```aql
BIT_TEST(0, 3) // false
BIT_TEST(255, 0) // true
BIT_TEST(7, 2) // true
BIT_TEST(255, 8) // false
```

BIT_TO_STRING()
---------------

`BIT_TO_STRING(number) → bitstring`

Converts a numeric input value into a bitstring, consisting of `0` and `1`.

To convert a bitstring into a number, see [BIT_FROM_STRING()](#bit_from_string).

- **number** (number): the number to stringify
- returns **bitstring** (string\|null): bitstring generated from the input value

The input value must be a number between 0 and 2<sup>32</sup> - 1 (including).
The function will return `null` for any other inputs and produce a warning.

```aql
BIT_TO_STRING(7, 4) // "0111"
BIT_TO_STRING(255, 8) // "11111111"
BIT_TO_STRING(60, 8) // "00011110"
BIT_TO_STRING(1048576, 32) // "00000000000100000000000000000000"
```

BIT_XOR()
---------

`BIT_XOR(numbersArray) → result`

Exclusive-or-combines the numeric values in *numbersArray* into a single
numeric result value.

- **numbersArray** (array): array with numeric input values
- returns **result** (number\|null): xor-combined result

The function expects an array with numeric values as its input. The values in
the array must be numbers, which must not be negative. The maximum supported
input number value is 2<sup>32</sup> - 1. Input number values outside the
allowed range will make the function return `null` and produce a warning.
Any `null` values in the input array are ignored.

---

`BIT_XOR(value1, value2) → result`

If two numbers are passed as individual function parameters to `BIT_XOR()`, it
will return the bitwise exclusive or value of its two operands. Only numbers in
the range 0 to 2<sup>32</sup> - 1 are allowed as input values.

- **value1** (number): first operand
- **value2** (number): second operand
- returns **result** (number\|null): xor-combined result

```aql
BIT_XOR([1, 4, 8, 16]) // 29
BIT_XOR([3, 7, 63]) // 59
BIT_XOR([255, 127, null, 63]) // 191
BIT_XOR(255, 257) // 510
BIT_XOR("foo") // null
```
