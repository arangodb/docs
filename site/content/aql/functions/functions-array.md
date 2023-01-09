---
fileID: functions-array
title: Array functions
weight: 3610
description: 
layout: default
---
AQL provides functions for higher-level array manipulation. Also see the
[numeric functions](functions-numeric) for functions that work on number arrays.
If you want to concatenate the elements of an array equivalent to `join()`
in JavaScript, see [CONCAT()](functions-string#concat) and
[CONCAT_SEPARATOR()](functions-string#concat_separator) in the string functions chapter.

Apart from that, AQL also offers several language constructs:

- simple [array access](../aql-fundamentals/fundamentals-data-types#arrays--lists) of individual elements,
- [array operators](../advanced-features/advanced-array-operators) for array expansion and contraction,
  optionally with inline filter, limit and projection,
- [array comparison operators](../operators#array-comparison-operators) to compare
  each element in an array to a value or the elements of another array,
- loop-based operations on arrays using [FOR](../high-level-operations/operations-for),
  [SORT](../high-level-operations/operations-sort),
  [LIMIT](../high-level-operations/operations-limit),
  as well as [COLLECT](../high-level-operations/operations-collect) for grouping,
  which also offers efficient aggregation.

## APPEND()

`APPEND(anyArray, values, unique) → newArray`

Add all elements of an array to another array. All values are added at the end of the
array (right side).

It can also be used to append a single element to an array. It is not necessary to wrap
it in an array (unless it is an array itself). You may also use [PUSH()](#push) instead.

- **anyArray** (array): array with elements of arbitrary type
- **values** (array\|any): array, whose elements shall be added to *anyArray*
- **unique** (bool, *optional*): if set to *true*, only those *values* will be added
  that are not already contained in *anyArray*. The default is *false*.
- returns **newArray** (array): the modified array

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayAppend_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN APPEND([ 1, 2, 3 ], [ 5, 6, 9 ])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayAppend_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN APPEND([ 1, 2, 3 ], [ 3, 4, 5, 2, 9 ], true)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## CONTAINS_ARRAY()

This is an alias for [POSITION()](#position).


## COUNT()

This is an alias for [LENGTH()](#length).

## COUNT_DISTINCT()

`COUNT_DISTINCT(anyArray) → number`

Get the number of distinct elements in an array.

- **anyArray** (array): array with elements of arbitrary type
- returns **number**: the number of distinct elements in *anyArray*.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayCountDistinct_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN COUNT_DISTINCT([ 1, 2, 3 ])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayCountDistinct_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN COUNT_DISTINCT([ "yes", "no", "yes", "sauron", "no", "yes" ])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## COUNT_UNIQUE()

This is an alias for [COUNT_DISTINCT()](#count_distinct).

## FIRST()

`FIRST(anyArray) → firstElement`

Get the first element of an array. It is the same as `anyArray[0]`.

- **anyArray** (array): array with elements of arbitrary type
- returns **firstElement** (any\|null): the first element of *anyArray*, or *null* if
  the array is empty.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayFirst_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN FIRST([ 1, 2, 3 ])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayFirst_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN FIRST([])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## FLATTEN()

`FLATTEN(anyArray, depth) → flatArray`

Turn an array of arrays into a flat array. All array elements in *array* will be
expanded in the result array. Non-array elements are added as they are. The function
will recurse into sub-arrays up to the specified depth. Duplicates will not be removed.

Also see [array contraction](../advanced-features/advanced-array-operators#array-contraction).

- **array** (array): array with elements of arbitrary type, including nested arrays
- **depth** (number, *optional*):  flatten up to this many levels, the default is 1
- returns **flatArray** (array): a flattened array

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayFlatten_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN FLATTEN( [ 1, 2, [ 3, 4 ], 5, [ 6, 7 ], [ 8, [ 9, 10 ] ] ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





To fully flatten the example array, use a *depth* of 2:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayFlatten_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN FLATTEN( [ 1, 2, [ 3, 4 ], 5, [ 6, 7 ], [ 8, [ 9, 10 ] ] ], 2 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## INTERLEAVE()

<small>Introduced in: v3.7.1</small>

`INTERLEAVE(array1, array2, ... arrayN) → newArray`

Accepts an arbitrary number of arrays and produces a new array with the elements
interleaved. It iterates over the input arrays in a round robin fashion, picks one element
from each array per iteration, and combines them in that sequence into a result array.
The input arrays can have different amounts of elements.

- **arrays** (array, *repeatable*): an arbitrary number of arrays as multiple
  arguments (at least 2)
- returns **newArray** (array): the interleaved array

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayInterleave_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN INTERLEAVE( [1, 1, 1], [2, 2, 2], [3, 3, 3] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayInterleave_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN INTERLEAVE( [ 1 ], [2, 2], [3, 3, 3] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayInterleave_3
description: ''
render: input/output
version: '3.10'
release: stable
dataset: kShortestPathsGraph
---
FOR v, e, p IN 1..3 OUTBOUND 'places/Toronto' GRAPH 'kShortestPathsGraph'
  RETURN INTERLEAVE(p.vertices[*]._id, p.edges[*]._id)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## INTERSECTION()

`INTERSECTION(array1, array2, ... arrayN) → newArray`

Return the intersection of all arrays specified. The result is an array of values that
occur in all arguments.

Other set operations are [UNION()](#union),
[MINUS()](#minus) and
[OUTERSECTION()](#outersection).

- **arrays** (array, *repeatable*): an arbitrary number of arrays as multiple arguments
  (at least 2)
- returns **newArray** (array): a single array with only the elements, which exist in all
  provided arrays. The element order is random. Duplicates are removed.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayIntersection_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN INTERSECTION( [1,2,3,4,5], [2,3,4,5,6], [3,4,5,6,7] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayIntersection_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN INTERSECTION( [2,4,6], [8,10,12], [14,16,18] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## JACCARD()

<small>Introduced in: v3.7.0</small>

`JACCARD(array1, array2) → jaccardIndex`

Calculate the [Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index)
of two arrays.

This similarity measure is also known as _Intersection over Union_ and could
be computed (less efficient and more verbose) as follows:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
COUNT(a) == 0 && COUNT(b) == 0
? 1 // two empty sets have a similarity of 1 by definition
: COUNT(INTERSECTION(array1, array2)) / COUNT(UNION_DISTINCT(array1, array2))
```
{{% /tab %}}
{{< /tabs >}}

- **array1** (array): array with elements of arbitrary type
- **array2** (array): array with elements of arbitrary type
- returns **jaccardIndex** (number): calculated Jaccard index of the input
  arrays *array1* and *array2*


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayJaccard_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN JACCARD( [1,2,3,4], [3,4,5,6] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayJaccard_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN JACCARD( [1,1,2,2,2,3], [2,2,3,4] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayJaccard_3
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN JACCARD( [1,2,3], [] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayJaccard_4
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN JACCARD( [], [] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## LAST()

`LAST(anyArray) → lastElement`

Get the last element of an array. It is the same as `anyArray[-1]`.

- **anyArray** (array): array with elements of arbitrary type
- returns **lastElement** (any\|null): the last element of *anyArray* or *null* if the
  array is empty.

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayLast_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN LAST( [1,2,3,4,5] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## LENGTH()

`LENGTH(anyArray) → length`

Determine the number of elements in an array.

- **anyArray** (array): array with elements of arbitrary type
- returns **length** (number): the number of array elements in *anyArray*.

*LENGTH()* can also determine the [number of attribute keys](functions-document#length)
of an object / document, the [amount of documents](functions-miscellaneous#length) in a
collection and the [character length](functions-string#length) of a string.

| Input  | Length |
|--------|--------|
| String | Number of Unicode characters |
| Number | Number of Unicode characters that represent the number |
| Array  | Number of elements |
| Object | Number of first level elements |
| true   | 1 |
| false  | 0 |
| null   | 0 |

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayLength_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN LENGTH( "🥑" )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayLength_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN LENGTH( 1234 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayLength_3
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN LENGTH( [1,2,3,4,5,6,7] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayLength_4
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN LENGTH( false )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayLength_5
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN LENGTH( {a:1, b:2, c:3, d:4, e:{f:5,g:6}} )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## MINUS()

`MINUS(array1, array2, ... arrayN) → newArray`

Return the difference of all arrays specified.

Other set operations are [UNION()](#union),
[INTERSECTION()](#intersection) and
[OUTERSECTION()](#outersection).

- **arrays** (array, *repeatable*): an arbitrary number of arrays as multiple
  arguments (at least 2)
- returns **newArray** (array): an array of values that occur in the first array,
  but not in any of the subsequent arrays. The order of the result array is undefined
  and should not be relied on. Duplicates will be removed.

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayMinus_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN MINUS( [1,2,3,4], [3,4,5,6], [5,6,7,8] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## NTH()

`NTH(anyArray, position) → nthElement`

Get the element of an array at a given position. It is the same as `anyArray[position]`
for positive positions, but does not support negative positions.

- **anyArray** (array): array with elements of arbitrary type
- **position** (number): position of desired element in array, positions start at 0
- returns **nthElement** (any\|null): the array element at the given *position*.
  If *position* is negative or beyond the upper bound of the array,
  then *null* will be returned.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayNth_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN NTH( [ "foo", "bar", "baz" ], 2 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayNth_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN NTH( [ "foo", "bar", "baz" ], 3 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayNth_3
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN NTH( [ "foo", "bar", "baz" ], -1 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## OUTERSECTION()

`OUTERSECTION(array1, array2, ... arrayN) → newArray`

Return the values that occur only once across all arrays specified.

Other set operations are [UNION()](#union),
[MINUS()](#minus) and
[INTERSECTION()](#intersection).

- **arrays** (array, *repeatable*): an arbitrary number of arrays as multiple arguments
  (at least 2)
- returns **newArray** (array): a single array with only the elements that exist only once
  across all provided arrays. The element order is random.

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayOutersection_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN OUTERSECTION( [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## POP()

`POP(anyArray) → newArray`

Remove the last element of *array*.

To append an element (right side), see [PUSH()](#push).<br>
To remove the first element, see [SHIFT()](#shift).<br>
To remove an element at an arbitrary position, see [REMOVE_NTH()](#remove_nth).

- **anyArray** (array): an array with elements of arbitrary type
- returns **newArray** (array): *anyArray* without the last element. If it's already
  empty or has only a single element left, an empty array is returned.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayPop_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN POP( [ 1, 2, 3, 4 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayPop_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN POP( [ 1 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## POSITION()

`POSITION(anyArray, search, returnIndex) → position`

Return whether *search* is contained in *array*. Optionally return the position.

- **anyArray** (array): the haystack, an array with elements of arbitrary type
- **search** (any): the needle, an element of arbitrary type
- **returnIndex** (bool, *optional*): if set to *true*, the position of the match
  is returned instead of a boolean. The default is *false*.
- returns **position** (bool\|number): *true* if *search* is contained in *anyArray*,
  *false* otherwise. If *returnIndex* is enabled, the position of the match is
  returned (positions start at 0), or *-1* if it's not found.

To determine if or at which position a string occurs in another string, see the
[CONTAINS() string function](functions-string#contains).

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayPosition_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN POSITION( [2,4,6,8], 4 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayPosition_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN POSITION( [2,4,6,8], 4, true )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## PUSH()

`PUSH(anyArray, value, unique) → newArray`

Append *value* to *anyArray* (right side).

To remove the last element, see [POP()](#pop).<br>
To prepend a value (left side), see [UNSHIFT()](#unshift).<br>
To append multiple elements, see [APPEND()](#append).

- **anyArray** (array): array with elements of arbitrary type
- **value** (any): an element of arbitrary type
- **unique** (bool): if set to *true*, then *value* is not added if already
  present in the array. The default is *false*.
- returns **newArray** (array): *anyArray* with *value* added at the end
  (right side)

Note: The *unique* flag only controls if *value* is added if it's already present
in *anyArray*. Duplicate elements that already exist in *anyArray* will not be
removed. To make an array unique, use the [UNIQUE()](#unique) function.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayPush_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN PUSH([ 1, 2, 3 ], 4)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayPush_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN PUSH([ 1, 2, 2, 3 ], 2, true)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## REMOVE_NTH()

`REMOVE_NTH(anyArray, position) → newArray`

Remove the element at *position* from the *anyArray*.

To remove the first element, see [SHIFT()](#shift).<br>
To remove the last element, see [POP()](#pop).

- **anyArray** (array): array with elements of arbitrary type
- **position** (number): the position of the element to remove. Positions start
  at 0. Negative positions are supported, with -1 being the last array element.
  If *position* is out of bounds, the array is returned unmodified.
- returns **newArray** (array): *anyArray* without the element at *position*

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayRemoveNth_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REMOVE_NTH( [ "a", "b", "c", "d", "e" ], 1 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayRemoveNth_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REMOVE_NTH( [ "a", "b", "c", "d", "e" ], -2 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## REPLACE_NTH()

<small>Introduced in: v3.7.0</small>

`REPLACE_NTH(anyArray, position, replaceValue, defaultPaddingValue) → newArray`

Replace the element at *position* in *anyArray* with *replaceValue*.

- **anyArray** (array): array with elements of arbitrary type
- **position** (number): the position of the element to replace. Positions start
  at 0. Negative positions are supported, with -1 being the last array element.
  If a negative *position* is out of bounds, then it is set to the first element (0)
- **replaceValue** the value to be inserted at *position*
- **defaultPaddingValue** to be used for padding if *position* is two or more
  elements beyond the last element in *anyArray*
- returns **newArray** (array): *anyArray* with the element at *position*
  replaced by *replaceValue*, or appended to *anyArray* and possibly padded by
  *defaultPaddingValue*

It is allowed to specify a position beyond the upper array boundary:
- *replaceValue* is appended if *position* is equal to the array length
- if it is higher, *defaultPaddingValue* is appended to *anyArray* as many
  times as needed to place *replaceValue* at *position*
- if no *defaultPaddingValue* is supplied in above case, then a query error
  is raised

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayReplaceNth_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REPLACE_NTH( [ "a", "b", "c" ], 1 , "z")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayReplaceNth_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REPLACE_NTH( [ "a", "b", "c" ], 3 , "z")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayReplaceNth_4
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REPLACE_NTH( [ "a", "b", "c" ], 6, "z", "y" )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayReplaceNth_5
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REPLACE_NTH( [ "a", "b", "c" ], -1, "z" )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayReplaceNth_6
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REPLACE_NTH( [ "a", "b", "c" ], -9, "z" )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





Trying to access out of bounds, without providing a padding value will result in an error:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: aqlArrayReplaceNth_3
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._query('RETURN REPLACE_NTH( [ "a", "b", "c" ], 6 , "z")'); // xpError(ERROR_QUERY_FUNCTION_ARGUMENT_TYPE_MISMATCH)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## REMOVE_VALUE()

`REMOVE_VALUE(anyArray, value, limit) → newArray`

Remove all occurrences of *value* in *anyArray*. Optionally with a *limit*
to the number of removals.

- **anyArray** (array): array with elements of arbitrary type
- **value** (any): an element of arbitrary type
- **limit** (number, *optional*): cap the number of removals to this value
- returns **newArray** (array): *anyArray* with *value* removed

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayRemoveValue_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REMOVE_VALUE( [ "a", "b", "b", "a", "c" ], "a" )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayRemoveValue_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REMOVE_VALUE( [ "a", "b", "b", "a", "c" ], "a", 1 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## REMOVE_VALUES()

`REMOVE_VALUES(anyArray, values) → newArray`

Remove all occurrences of any of the *values* from *anyArray*.

- **anyArray** (array): array with elements of arbitrary type
- **values** (array): an array with elements of arbitrary type, that shall
  be removed from *anyArray*
- returns **newArray** (array): *anyArray* with all individual *values* removed

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayRemoveValues_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REMOVE_VALUES( [ "a", "a", "b", "c", "d", "e", "f" ], [ "a", "f", "d" ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## REVERSE()

`REVERSE(anyArray) → reversedArray`

Return an array with its elements reversed.

- **anyArray** (array): array with elements of arbitrary type
- returns **reversedArray** (array): a new array with all elements of *anyArray* in
  reversed order

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayReverse_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN REVERSE ( [2,4,6,8,10] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## SHIFT()

`SHIFT(anyArray) → newArray`

Remove the first element of *anyArray*.

To prepend an element (left side), see [UNSHIFT()](#unshift).<br>
To remove the last element, see [POP()](#pop).<br>
To remove an element at an arbitrary position, see [REMOVE_NTH()](#remove_nth).

- **anyArray** (array): array with elements with arbitrary type
- returns **newArray** (array): *anyArray* without the left-most element. If *anyArray*
  is already empty or has only one element left, an empty array is returned.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayShift_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SHIFT( [ 1, 2, 3, 4 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayShift_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SHIFT( [ 1 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## SLICE()

`SLICE(anyArray, start, length) → newArray`

Extract a slice of *anyArray*.

- **anyArray** (array): array with elements of arbitrary type
- **start** (number): start extraction at this element. Positions start at 0.
  Negative values indicate positions from the end of the array.
- **length** (number, *optional*): extract up to *length* elements, or all
  elements from *start* up to *length* if negative (exclusive)
- returns **newArray** (array): the specified slice of *anyArray*. If *length*
  is not specified, all array elements starting at *start* will be returned.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySlice_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SLICE( [ 1, 2, 3, 4, 5 ], 0, 1 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySlice_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SLICE( [ 1, 2, 3, 4, 5 ], 1, 2 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySlice_3
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SLICE( [ 1, 2, 3, 4, 5 ], 3 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySlice_4
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SLICE( [ 1, 2, 3, 4, 5 ], 1, -1 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySlice_5
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SLICE( [ 1, 2, 3, 4, 5 ], 0, -2 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySlice_6
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SLICE( [ 1, 2, 3, 4, 5 ], -3, 2 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## SORTED()

`SORTED(anyArray) → newArray`

Sort all elements in *anyArray*. The function will use the default comparison
order for AQL value types.

- **anyArray** (array): array with elements of arbitrary type
- returns **newArray** (array): *anyArray*, with elements sorted

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySorted_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SORTED( [ 8,4,2,10,6 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## SORTED_UNIQUE()

`SORTED_UNIQUE(anyArray) → newArray`

Sort all elements in *anyArray*. The function will use the default comparison
order for AQL value types. Additionally, the values in the result array will
be made unique.

- **anyArray** (array): array with elements of arbitrary type
- returns **newArray** (array): *anyArray*, with elements sorted and duplicates
  removed

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArraySortedUnique_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN SORTED_UNIQUE( [ 8,4,2,10,6,2,8,6,4 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## UNION()

`UNION(array1, array2, ... arrayN) → newArray`

Return the union of all arrays specified.

Other set operations are [MINUS()](#minus),
[INTERSECTION()](#intersection) and
[OUTERSECTION()](#outersection).

- **arrays** (array, *repeatable*): an arbitrary number of arrays as multiple
  arguments (at least 2)
- returns **newArray** (array): all array elements combined in a single array,
  in any order

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayUnion_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN UNION(
[ 1, 2, 3 ],
[ 1, 2 ]
)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





Note: No duplicates will be removed. In order to remove duplicates, please use
either [UNION_DISTINCT()](#union_distinct)
or apply [UNIQUE()](#unique) on the
result of *UNION()*:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayUnion_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN UNIQUE(
UNION(
[ 1, 2, 3 ],
[ 1, 2 ]
)
)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## UNION_DISTINCT()

`UNION_DISTINCT(array1, array2, ... arrayN) → newArray`

Return the union of distinct values of all arrays specified.

- **arrays** (array, *repeatable*): an arbitrary number of arrays as multiple
  arguments (at least 2)
- returns **newArray** (array): the elements of all given arrays in a single
  array, without duplicates, in any order

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayUnionDistinct_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN UNION_DISTINCT(
[ 1, 2, 3 ],
[ 1, 2 ]
)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## UNIQUE()

`UNIQUE(anyArray) → newArray`

Return all unique elements in *anyArray*. To determine uniqueness, the
function will use the comparison order.

- **anyArray** (array): array with elements of arbitrary type
- returns **newArray** (array): *anyArray* without duplicates, in any order

**Example**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayUnique_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN UNIQUE( [ 1,2,2,3,3,3,4,4,4,4,5,5,5,5,5 ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## UNSHIFT()

`UNSHIFT(anyArray, value, unique) → newArray`

Prepend *value* to *anyArray* (left side).

To remove the first element, see [SHIFT()](#shift).<br>
To append a value (right side), see [PUSH()](#push).

- **anyArray** (array): array with elements of arbitrary type
- **value** (any): an element of arbitrary type
- **unique** (bool): if set to *true*, then *value* is not added if already
  present in the array. The default is *false*.
- returns **newArray** (array): *anyArray* with *value* added at the start
  (left side)

Note: The *unique* flag only controls if *value* is added if it's already present
in *anyArray*. Duplicate elements that already exist in *anyArray* will not be
removed. To make an array unique, use the [UNIQUE()](#unique) function.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayUnshift_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN UNSHIFT( [ 1, 2, 3 ], 4 )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}






 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlArrayUnshift_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN UNSHIFT( [ 1, 2, 3 ], 2, true )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}




