---
fileID: functions-numeric
title: Numeric functions
weight: 3730
description: 
layout: default
---
AQL offers some numeric functions for calculations. The following functions are
supported:

## ABS()

`ABS(value) → unsignedValue`

Return the absolute part of *value*.

- **value** (number): any number, positive or negative
- returns **unsignedValue** (number): the number without + or - sign

```aql
ABS(-5) // 5
ABS(+5) // 5
ABS(3.5) // 3.5
```

## ACOS()

`ACOS(value) → num`

Return the arccosine of *value*.

- **value** (number): the input value
- returns **num** (number\|null): the arccosine of *value*, or *null* if *value* is
  outside the valid range -1 and 1 (inclusive)

```aql
ACOS(-1) // 3.141592653589793
ACOS(0) // 1.5707963267948966
ACOS(1) // 0
ACOS(2) // null
```

## ASIN()

`ASIN(value) → num`

Return the arcsine of *value*.

- **value** (number): the input value
- returns **num** (number\|null): the arcsine of *value*, or *null* if *value* is
  outside the valid range -1 and 1 (inclusive)

```aql
ASIN(1) // 1.5707963267948966
ASIN(0) // 0
ASIN(-1) // -1.5707963267948966
ASIN(2) // null
```

## ATAN()

`ATAN(value) → num`

Return the arctangent of *value*.

- **value** (number): the input value
- returns **num** (number): the arctangent of *value*

```aql
ATAN(-1) // -0.7853981633974483
ATAN(0) // 0
ATAN(10) // 1.4711276743037347
```

## ATAN2()

`ATAN2(y, x) → num`

Return the arctangent of the quotient of *y* and *x*.

```aql
ATAN2(0, 0) // 0
ATAN2(1, 0) // 1.5707963267948966
ATAN2(1, 1) // 0.7853981633974483
ATAN2(-10, 20) // -0.4636476090008061
```

## AVERAGE()

`AVERAGE(numArray) → mean`

Return the average (arithmetic mean) of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **mean** (number\|null): the average value of *numArray*. If the array is
  empty or contains *null* values only, *null* will be returned.

```aql
AVERAGE( [5, 2, 9, 2] ) // 4.5
AVERAGE( [ -3, -5, 2 ] ) // -2
AVERAGE( [ 999, 80, 4, 4, 4, 3, 3, 3 ] ) // 137.5
```

## AVG()

This is an alias for [AVERAGE()](#average).

## CEIL()

`CEIL(value) → roundedValue`

Return the integer closest but not less than *value*.

To round downward, see [FLOOR()](#floor).<br>
To round to the nearest integer value, see [ROUND()](#round).

- **value** (number): any number
- returns **roundedValue** (number): the value rounded to the ceiling

```aql
CEIL(2.49) // 3
CEIL(2.50) // 3
CEIL(-2.50) // -2
CEIL(-2.51) // -2
```

## COS()

`COS(value) → num`

Return the cosine of *value*.

- **value** (number): the input value
- returns **num** (number): the cosine of *value*

```aql
COS(1) // 0.5403023058681398 
COS(0) // 1
COS(-3.141592653589783) // -1
COS(RADIANS(45)) // 0.7071067811865476
```

## COSINE_SIMILARITY()

<small>Introduced in: v3.9.0</small>

`COSINE_SIMILARITY(x, y) → num`

Return the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
between *x* and *y*.

To calculate the distance, see [L1_DISTANCE()](#l1_distance) and
[L2_DISTANCE()](#l2_distance).

- **x** (array): first input array
- **y** (array): second input array
- returns **num** (number\|array): the cosine similarity value.
  If one of the inputs is a nested (2D) array, then an array is returned.
  The length of each 2D array row should be equal to the length of second input
  array in that case.

In case of invalid input values the function returns **null** and produces a warning.

```aql
COSINE_SIMILARITY([0,1], [1,0]) // 0
COSINE_SIMILARITY([[0,1,0,1],[1,0,0,1],[1,1,1,0],[0,0,0,1]], [1,1,1,1]) // [0.707, 0.707, 0.866, 0.5]
COSINE_SIMILARITY([-1,0], [1,0]) // -1
```

## DECAY_GAUSS()

<small>Introduced in: v3.9.0</small>

`DECAY_GAUSS(value, origin, scale, offset, decay) → score`

Calculate the score for one or multiple values with a **Gaussian function** that
decays depending on the distance of a numeric value from a user-given origin.

- **value** (number\|array): the input value or an array with input values
- **origin** (number): the point of origin used for calculating the distance
- **scale** (number): defines the distance from `origin` + `offset` at which
  the computed score will equal the `decay` parameter
- **offset** (number): the decay function will be evaluated for distance values
  greater than the defined offset
- **decay** (number): the decay parameter defines how input values are scored
  at the distance given by the `scale` parameter
- returns **score** (number\|array): a single score or an array of scores
  depending on the type of the input `value`

```aql
DECAY_GAUSS(41, 40, 5, 5, 0.5) // 1
DECAY_GAUSS([20, 41], 40, 5, 5, 0.5) // [0.0019531250000000017, 1.0]
DECAY_GAUSS(49.9889, 49.987, 0.001, 0.001, 0.2) // 0.2715403018822964
```

## DECAY_EXP()

<small>Introduced in: v3.9.0</small>

`DECAY_EXP(value, origin, scale, offset, decay) → num, array`

Calculate the score for one or multiple values with an **exponential function**
that decays depending on the distance of a numeric value from a user-given origin.

- **value** (number\|array): the input value or an array with input values
- **origin** (number): the point of origin used for calculating the distance
- **scale** (number): defines the distance from `origin` + `offset` at which
  the computed score will equal the `decay` parameter
- **offset** (number): the decay function will be evaluated for distance values
  greater than the defined offset
- **decay** (number): the decay parameter defines how input values are scored
  at the distance given by the `scale` parameter
- returns **score** (number\|array): a single score or an array of scores
  depending on the type of the input `value`

```aql
DECAY_EXP(41, 40, 5, 5, 0.7) // 1
DECAY_EXP(2, 0, 10, 0, 0.2)  // 0.7247796636776955
DECAY_EXP(49.9889, 50, 0.001, 0.001, 0.2) // 8.717720806626885e-08
```

## DECAY_LINEAR()

<small>Introduced in: v3.9.0</small>

`DECAY_LINEAR(value, origin, scale, offset, decay) → score`

Calculate the score for one or multiple values with a **linear function** that
decays depending on the distance of a numeric value from a user-given origin.

- **value** (number\|array): the input value or an array with input values
- **origin** (number): the point of origin used for calculating the distance
- **scale** (number): defines the distance from `origin` + `offset` at which
  the computed score will equal the `decay` parameter
- **offset** (number): the decay function will be evaluated for distance values
  greater than the defined offset
- **decay** (number): the decay parameter defines how input values are scored
  at the distance given by the `scale` parameter
- returns **score** (number\|array): a single score or an array of scores
  depending on the type of the input `value`

```aql
DECAY_LINEAR(41, 40, 5, 5, 0.5)   // 1
DECAY_LINEAR(9.8, 0, 10, 0, 0.2)  // 0.21599999999999994
DECAY_LINEAR(5..7, 0, 10, 0, 0.2) // [0.6, 0.52, 0.44]
```

## DEGREES()

`DEGREES(rad) → num`

Return the angle converted from radians to degrees.

- **rad** (number): the input value
- returns **num** (number): the angle in degrees

```aql
DEGREES(0.7853981633974483) // 45
DEGREES(0) // 0
DEGREES(3.141592653589793) // 180
```

## EXP()

`EXP(value) → num`

Return Euler's constant (2.71828...) raised to the power of *value*.

- **value** (number): the input value
- returns **num** (number): Euler's constant raised to the power of *value*

```aql
EXP(1) // 2.718281828459045
EXP(10) // 22026.46579480671
EXP(0) // 1
```

## EXP2()

`EXP2(value) → num`

Return 2 raised to the power of *value*.

- **value** (number): the input value
- returns **num** (number): 2 raised to the power of *value*

```aql
EXP2(16) // 65536
EXP2(1) // 2
EXP2(0) // 1
```

## FLOOR()

`FLOOR(value) → roundedValue`

Return the integer closest but not greater than *value*.

To round upward, see [CEIL()](#ceil).<br>
To round to the nearest integer value, see [ROUND()](#round).

- **value** (number): any number
- returns **roundedValue** (number): the value rounded downward

```aql
FLOOR(2.49) // 2
FLOOR(2.50) // 2
FLOOR(-2.50) // -3
FLOOR(-2.51) // -3
```

## LOG()

`LOG(value) → num`

Return the natural logarithm of *value*. The base is Euler's
constant (2.71828...).

- **value** (number): the input value
- returns **num** (number\|null): the natural logarithm of *value*, or *null* if *value* is
  equal or less than 0

```aql
LOG(2.718281828459045) // 1
LOG(10) // 2.302585092994046
LOG(0) // null
```

## LOG2()

`LOG2(value) → num`

Return the base 2 logarithm of *value*.

- **value** (number): the input value
- returns **num** (number\|null): the base 2 logarithm of *value*, or *null* if *value* is
  equal or less than 0

```aql
LOG2(1024) // 10
LOG2(8) // 3
LOG2(0) // null
```

## LOG10()

`LOG10(value) → num`

Return the base 10 logarithm of *value*.

- **value** (number): the input value
- returns **num** (number): the base 10 logarithm of *value*, or *null* if *value* is
  equal or less than 0

```aql
LOG10(10000) // 4
LOG10(10) // 1
LOG10(0) // null
```

## L1_DISTANCE()

<small>Introduced in: v3.9.0</small>

`L1_DISTANCE(x, y) → num`

Return the [Manhattan distance](https://en.wikipedia.org/wiki/Taxicab_geometry)
between *x* and *y*.

To calculate the similarity, see [COSINE_SIMILARITY()](#cosine_similarity).

- **x** (array): first input array
- **y** (array): second input array
- returns **num** (number\|array): the L1 distance value.
  If one of the inputs is a nested (2D) array, then an array is returned.
  The length of each inner array should be equal to the length of second input
  array in that case.

In case of invalid input values the function returns **null** and produces a warning.

```aql
L1_DISTANCE([-1,-1], [2,2]) // 6
L1_DISTANCE([[1,2,3],[-1,-2,-3],[3,4,5],[-5,2,1]], [1,1,1]) // [3,9,9,7]
L1_DISTANCE([1.5], [3]) // 1.5
```

## L2_DISTANCE()

<small>Introduced in: v3.9.0</small>

`L2_DISTANCE(x,y) → num`

Return the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)
between *x* and *y*.

To calculate the similarity, see [COSINE_SIMILARITY()](#cosine_similarity).

- **x** (array): first input array
- **y** (array): second input array
- returns **num** (number\|array): the L2 distance value.
  If one of the inputs is a nested (2D) array, then an array is returned.
  The length of each inner array should be equal to the length of second input
  array in that case.

In case of invalid input values the function returns **null** and produces a warning.

```aql
L2_DISTANCE([1,1], [5,2]) // 4.1231056256176606
L2_DISTANCE([[1,2,3], [4,5,6], [7,8,9]], [3,2,1]) // [2.8284271247461903, 5.916079783099616, 10.770329614269007]
L2_DISTANCE([0,1], [1,0]) // 1.4142135623730951
```

## MAX()

`MAX(anyArray) → max`

Return the greatest element of *anyArray*. The array is not limited to numbers.
Also see [type and value order](../aql-fundamentals/fundamentals-type-value-order).

- **anyArray** (array): an array of numbers, *null* values are ignored
- returns **max** (any\|null): the element with the greatest value. If the array is
  empty or contains *null* values only, the function will return *null*.

```aql
MAX( [5, 9, -2, null, 1] ) // 9
MAX( [ null, null ] ) // null
```

## MEDIAN()

`MEDIAN(numArray) → median`

Return the median value of the values in *array*.

The array is sorted and the element in the middle is returned. If the array has an
even length of elements, the two center-most elements are interpolated by calculating
the average value (arithmetic mean).

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **median** (number\|null): the median of *numArray*. If the array is
  empty or contains *null* values only, the function will return *null*.

```aql
MEDIAN( [ 1, 2, 3] ) // 2
MEDIAN( [ 1, 2, 3, 4 ] ) // 2.5
MEDIAN( [ 4, 2, 3, 1 ] ) // 2.5
MEDIAN( [ 999, 80, 4, 4, 4, 3, 3, 3 ] ) // 4
```

## MIN()

`MIN(anyArray) → min`

Return the smallest element of *anyArray*. The array is not limited to numbers.
Also see [type and value order](../aql-fundamentals/fundamentals-type-value-order).

- **anyArray** (array): an array of numbers, *null* values are ignored
- returns **min** (any\|null): the element with the smallest value. If the array is
  empty or contains *null* values only, the function will return *null*.

```aql
MIN( [5, 9, -2, null, 1] ) // -2
MIN( [ null, null ] ) // null
```

## PERCENTILE()

`PERCENTILE(numArray, n, method) → percentile`

Return the *n*th percentile of the values in *numArray*.

- **numArray** (array): an array of numbers, *null* values are ignored
- **n** (number): must be between 0 (excluded) and 100 (included)
- **method** (string, *optional*): "rank" (default) or "interpolation"
- returns **percentile** (number\|null): the *n*th percentile, or *null* if the
  array is empty or only *null* values are contained in it or the percentile
  cannot be calculated

```aql
PERCENTILE( [1, 2, 3, 4], 50 ) // 2
PERCENTILE( [1, 2, 3, 4], 50, "rank" ) // 2
PERCENTILE( [1, 2, 3, 4], 50, "interpolation" ) // 2.5
```

## PI()

`PI() → pi`

Return pi.

- returns **pi** (number): the first few significant digits of pi (3.141592653589793)

```aql
PI() // 3.141592653589793
```

## POW()

`POW(base, exp) → num`

Return the *base* to the exponent *exp*.

- **base** (number): the base value
- **exp** (number): the exponent value
- returns **num** (number): the exponentiated value

```aql
POW( 2, 4 ) // 16
POW( 5, -1 ) // 0.2
POW( 5, 0 ) // 1
```

## PRODUCT()

<small>Introduced in: v3.7.2</small>

`PRODUCT(numArray) → product`

Return the product of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **product** (number): the product of all values in *numArray*. If the array
  is empty or only *null* values are contained in the array, *1* will be returned.

```aql
PRODUCT( [1, 2, 3, 4] ) // 24
PRODUCT( [null, -5, 6] ) // -30
PRODUCT( [ ] ) // 1
```

## RADIANS()

`RADIANS(deg) → num`

Return the angle converted from degrees to radians.

- **deg** (number): the input value
- returns **num** (number): the angle in radians

```aql
RADIANS(180) // 3.141592653589793
RADIANS(90) // 1.5707963267948966
RADIANS(0) // 0
```

## RAND()

`RAND() → randomNumber`

Return a pseudo-random number between 0 and 1.

- returns **randomNumber** (number): a number greater than 0 and less than 1

```aql
RAND() // 0.3503170117504508
RAND() // 0.6138226173882478
```

Complex example:

```aql
LET coinFlips = (
    FOR i IN 1..100000
    RETURN RAND() > 0.5 ? "heads" : "tails"
)
RETURN MERGE(
    FOR flip IN coinFlips
        COLLECT f = flip WITH COUNT INTO count
        RETURN { [f]: count }
)
```

Result:

```json
[
  {
    "heads": 49902,
    "tails": 50098
  }
]
```

## RANGE()

`RANGE(start, stop, step) → numArray`

Return an array of numbers in the specified range, optionally with increments
other than 1. The *start* and *stop* arguments are truncated to integers
unless a *step* argument is provided.

Also see the [range operator](../operators#range-operator) for ranges
with integer bounds and a step size of 1.

- **start** (number): the value to start the range at (inclusive)
- **stop** (number): the value to end the range with (inclusive)
- **step** (number, *optional*): how much to increment in every step,
  the default is *1.0*
- returns **numArray** (array): all numbers in the range as array

```aql
RANGE(1, 4) // [ 1, 2, 3, 4 ]
RANGE(1, 4, 2) // [ 1, 3 ]
RANGE(1, 4, 3) // [ 1, 4 ]
RANGE(1.5, 2.5) // [ 1, 2 ]
RANGE(1.5, 2.5, 1) // [ 1.5, 2.5 ]
RANGE(1.5, 2.5, 0.5) // [ 1.5, 2, 2.5 ]
RANGE(-0.75, 1.1, 0.5) // [ -0.75, -0.25, 0.25, 0.75 ]
```

## ROUND()

`ROUND(value) → roundedValue`

Return the integer closest to *value*.

- **value** (number): any number
- returns **roundedValue** (number): the value rounded to the closest integer

```aql
ROUND(2.49) // 2
ROUND(2.50) // 3
ROUND(-2.50) // -2
ROUND(-2.51) // -3
```

Rounding towards zero, also known as *trunc()* in C/C++, can be achieved with
a combination of the [ternary operator](../operators#ternary-operator),
[CEIL()](#ceil)
and [FLOOR()](#floor):

```aql
value >= 0 ? FLOOR(value) : CEIL(value)
```

## SIN()

`SIN(value) → num`

Return the sine of *value*.

- **value** (number): the input value
- returns **num** (number): the sine of *value*

```aql
SIN(3.141592653589783 / 2) // 1
SIN(0) // 0
SIN(-3.141592653589783 / 2) // -1
SIN(RADIANS(270)) // -1
```

## SQRT()

`SQRT(value) → squareRoot`

Return the square root of *value*.

- **value** (number): a number
- returns **squareRoot** (number): the square root of *value*

```aql
SQRT(9) // 3
SQRT(2) // 1.4142135623730951
```

Other roots can be calculated with [POW()](#pow) like `POW(value, 1/n)`:

```aql
// 4th root of 8*8*8*8 = 4096
POW(4096, 1/4) // 8

// cube root of 3*3*3 = 27
POW(27, 1/3) // 3

// square root of 3*3 = 9
POW(9, 1/2) // 3
```

## STDDEV_POPULATION()

`STDDEV_POPULATION(numArray) → num`

Return the population standard deviation of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **num** (number\|null): the population standard deviation of *numArray*.
  If the array is empty or only *null* values are contained in the array, 
  *null* will be returned.

```aql
STDDEV_POPULATION( [ 1, 3, 6, 5, 2 ] ) // 1.854723699099141
```

## STDDEV_SAMPLE()

`STDDEV_SAMPLE(numArray) → num`

Return the sample standard deviation of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **num** (number\|null): the sample standard deviation of *numArray*.
  If the array is empty or only *null* values are contained in the array, 
  *null* will be returned.

```aql
STDDEV_SAMPLE( [ 1, 3, 6, 5, 2 ] ) // 2.0736441353327724
```

## STDDEV()

This is an alias for [STDDEV_POPULATION()](#stddev_population).

## SUM()

`SUM(numArray) → sum`

Return the sum of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **sum** (number): the total of all values in *numArray*. If the array
  is empty or only *null* values are contained in the array, *0* will be returned.

```aql
SUM( [1, 2, 3, 4] ) // 10
SUM( [null, -5, 6] ) // 1
SUM( [ ] ) // 0
```

## TAN()

`TAN(value) → num`

Return the tangent of *value*.

- **value** (number): the input value
- returns **num** (number): the tangent of *value*

```aql
TAN(10) // 0.6483608274590866
TAN(5) // -3.380515006246586
TAN(0) // 0
```

## VARIANCE_POPULATION()

`VARIANCE_POPULATION(numArray) → num`

Return the population variance of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **num** (number\|null): the population variance of *numArray*.
  If the array is empty or only *null* values are contained in the array, 
  *null* will be returned.

```aql
VARIANCE_POPULATION( [ 1, 3, 6, 5, 2 ] ) // 3.4400000000000004
```

## VARIANCE_SAMPLE()

`VARIANCE_SAMPLE(array) → num`

Return the sample variance of the values in *array*.

- **numArray** (array): an array of numbers, *null* values are ignored
- returns **num** (number\|null): the sample variance of *numArray*.
  If the array is empty or only *null* values are contained in the array, 
  *null* will be returned.

```aql
VARIANCE_SAMPLE( [ 1, 3, 6, 5, 2 ] ) // 4.300000000000001
```

## VARIANCE()

This is an alias for [VARIANCE_POPULATION()](#variance_population).
