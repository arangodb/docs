---
fileID: functions-miscellaneous
title: Miscellaneous functions
weight: 3640
description: 
layout: default
---
`DOCUMENT(id) → doc`

The function can also be used with a single `id` parameter as follows:

- **id** (string\|array): a document identifier, or an array of identifiers
- returns **doc** (document\|array\|null): the found document (or `null` if it
  was not found), or an array of the found documents **in any order**

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: FUNCTION_DOCUMENT_7
description: ''
render: input/output
version: '3.10'
release: stable
dataset: knows_graph
---
RETURN DOCUMENT("persons/alice")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



  
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: FUNCTION_DOCUMENT_8
description: ''
render: input/output
version: '3.10'
release: stable
dataset: knows_graph
---
RETURN DOCUMENT( [ "persons/alice", "persons/bob" ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 




 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: FUNCTION_DOCUMENT_9
description: ''
render: input/output
version: '3.10'
release: stable
dataset: knows_graph
bindVars: 
  {
      "key": "persons/alice"
    }
---
RETURN DOCUMENT( @key )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 




 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: FUNCTION_DOCUMENT_10
description: ''
render: input/output
version: '3.10'
release: stable
dataset: knows_graph
bindVars: 
  {
      "keys": ["persons/alice", "persons/bob"]
    }
---
RETURN DOCUMENT( @keys )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 




 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: FUNCTION_DOCUMENT_11
description: ''
render: input/output
version: '3.10'
release: stable
dataset: knows_graph
bindVars: 
  {
      "key": "bob"
    }
---
RETURN DOCUMENT( CONCAT("persons/", @key) )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### LENGTH()

`LENGTH(coll) → documentCount`

Determine the amount of documents in a collection.

It calls [COLLECTION_COUNT()](#collection_count) internally.

- **coll** (collection): a collection (not string)
- returns **documentCount** (number): the total amount of documents in *coll*

*LENGTH()* can also determine the [number of elements](functions-array#length) in an array,
the [number of attribute keys](functions-document#length) of an object / document and
the [character length](functions-string#length) of a string.

### SHARD_ID()

`SHARD_ID(collection, shardKeys) → shardId`

Return the shard in a collection that contains the specified shard keys.

- **collection** (string): a collection name
- **shardKeys** (object): a set of shard keys and values. Any missing shard key
  is substituted with the `null` value.
- returns **shardId** (string): the responsible shard for the specified
  shard keys in the given collection. On deployments other than clusters,
  the collection name itself is returned.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: shard_id1_cluster
description: ''
render: input/output
version: '3.10'
release: stable
dataset: observationsSampleDataset
---
RETURN SHARD_ID("observations", { "time": "2021-05-25 07:15:00", "subject": "xh458", "val": 10 })
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Hash functions

### HASH()

`HASH(value) → hashNumber`

Calculate a hash value for *value*.

- **value** (any): an element of arbitrary type
- returns **hashNumber** (number): a hash value of *value*

*value* is not required to be a string, but can have any data type. The calculated
hash value will take the data type of *value* into account, so for example the
number *1* and the string *"1"* will have different hash values. For arrays the
hash values will be equal if the arrays contain exactly the same values
(including value types) in the same order. For objects the same hash values will
be created if the objects have exactly the same attribute names and values
(including value types). The order in which attributes appear inside objects
is not important for hashing.

The hash value returned by this function is a number. The hash algorithm is not
guaranteed to remain the same in future versions of ArangoDB. The hash values
should therefore be used only for temporary calculations, e.g. to compare if two
documents are the same, or for grouping values in queries.

### MINHASH()

`MINHASH(values, numHashes) → hashes`

Calculate MinHash signatures for the *values* using locality-sensitive hashing.
The result can be used to approximate the Jaccard similarity of sets.

- **values** (array): an array with elements of arbitrary type to hash
- **numHashes** (number): the size of the MinHash signature. Must be
  greater or equal to `1`. The signature size defines the probabilistic error
  (`err = rsqrt(numHashes)`). For an error amount that does not exceed 5%
  (`0.05`), use a size of `1 / (0.05 * 0.05) = 400`.
- returns **hashes** (array): an array of strings with the encoded hash values

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlMinHash
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN MINHASH(["foo", "bar", "baz"], 5)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### MINHASH_COUNT()

`MINHASH_COUNT(error) → numHashes`

Calculate the number of hashes (MinHash signature size) needed to not exceed the
specified error amount.

- **error** (number): the probabilistic error you can tolerate in the range `[0, 1)`
- returns **numHashes** (number): the required number of hashes to not exceed
  the specified error amount

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlMinHashCount
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN MINHASH_COUNT(0.05)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### MINHASH_ERROR()

`MINHASH_ERROR(numHashes) → error`

Calculate the error amount based on the number of hashes (MinHash signature size).

- **numHashes** (number): the number of hashes you want to check
- returns **error** (number): the probabilistic error to expect with the specified
  number of hashes

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlMinHashError
description: ''
render: input/output
version: '3.10'
release: stable
---
  RETURN MINHASH_ERROR(400)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### String-based hashing

See the following string functions:

- [CRC32()](functions-string#crc32)
- [FNV64()](functions-string#fnv64)
- [MD5()](functions-string#md5)
- [SHA1()](functions-string#sha1)
- [SHA512()](functions-string#sha512)

## Function calling

### APPLY()

`APPLY(functionName, arguments) → retVal`

Dynamically call the function *funcName* with the arguments specified.
Arguments are given as array and are passed as separate parameters to
the called function.

Both built-in and user-defined functions can be called. 

- **funcName** (string): a function name
- **arguments** (array, *optional*): an array with elements of arbitrary type
- returns **retVal** (any): the return value of the called function

{{< tabs >}}
{{% tab name="aql" %}}
```aql
APPLY( "SUBSTRING", [ "this is a test", 0, 7 ] )
// "this is"
```
{{% /tab %}}
{{< /tabs >}}

### CALL()

`CALL(funcName, arg1, arg2, ... argN) → retVal`

Dynamically call the function *funcName* with the arguments specified.
Arguments are given as multiple parameters and passed as separate
parameters to the called function.

Both built-in and user-defined functions can be called.

- **funcName** (string): a function name
- **args** (any, *repeatable*): an arbitrary number of elements as
  multiple arguments, can be omitted
- returns **retVal** (any): the return value of the called function

{{< tabs >}}
{{% tab name="aql" %}}
```aql
CALL( "SUBSTRING", "this is a test", 0, 4 )
// "this"
```
{{% /tab %}}
{{< /tabs >}}

## Other functions

### ASSERT() / WARN()

`ASSERT(expr, message) → retVal`<br>
`WARN(expr, message) → retVal`

The two functions evaluate an expression. In case the expression evaluates to
*true* both functions will return *true*. If the expression evaluates to
*false* *ASSERT* will throw an error and *WARN* will issue a warning and return
*false*. This behavior allows the use of *ASSERT* and *WARN* in `FILTER`
conditions.

- **expr** (expression): AQL expression to be evaluated
- **message** (string): message that will be used in exception or warning if expression evaluates to false
- returns **retVal** (bool): returns true if expression evaluates to true

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR i IN 1..3 FILTER ASSERT(i > 0, "i is not greater 0") RETURN i
FOR i IN 1..3 FILTER WARN(i < 2, "i is not smaller 2") RETURN i
```
{{% /tab %}}
{{< /tabs >}}

### IN_RANGE()

<small>Introduced in: v3.7.0</small>

`IN_RANGE(value, low, high, includeLow, includeHigh) → included`

Returns true if *value* is greater than (or equal to) *low* and less than
(or equal to) *high*. The values can be of different types. They are compared
as described in [Type and value order](../aql-fundamentals/fundamentals-type-value-order) and
is thus identical to the comparison operators `<`, `<=`, `>` and `>=` in
behavior.

- **value** (any): an element of arbitrary type
- **low** (any): minimum value of the desired range
- **high** (any): maximum value of the desired range
- **includeLow** (bool): whether the minimum value shall be included in
  the range (left-closed interval) or not (left-open interval)
- **includeHigh** (bool): whether the maximum value shall be included in
  the range (right-closed interval) or not (right-open interval)
- returns **included** (bool): whether *value* is in the range

If *low* and *high* are the same, but *includeLow* and/or *includeHigh* is set
to `false`, then nothing will match. If *low* is greater than *high* nothing will
match either.

{{% hints/info %}}
The regular `IN_RANGE()` function can not utilize indexes, unlike its
ArangoSearch counterpart which can use the View index.
{{% /hints/info %}}

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlMiscInRange_1
description: ''
render: input/output
version: '3.10'
release: stable
---
LET value = 4
RETURN IN_RANGE(value, 3, 5, true, true)
/* same as:
   RETURN value >= 3 AND value <= 5
*/
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

<!-- separator -->

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlMiscInRange_2
description: ''
render: input/output
version: '3.10'
release: stable
---
FOR value IN 2..6
  RETURN { value, in_range: IN_RANGE(value, 3, 5, false, true) }
  /* same as:
 RETURN { value, in_range: value > 3 AND value <= 5 }
  */
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

<!-- separator -->

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlMiscInRange_3
description: ''
render: input/output
version: '3.10'
release: stable
---
LET coll = [
  { text: "fennel" },
  { text: "fox grape" },
  { text: "forest strawberry" },
  { text: "fungus" }
]
FOR doc IN coll
  FILTER IN_RANGE(doc.text,"fo", "fp", true, false) // values with prefix "fo"
  /* same as:
 FILTER doc.text >= "fo" AND doc.text < "fp"
  */
  RETURN doc
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

### PREGEL_RESULT()

`PREGEL_RESULT(handle, withId) → results`

Allows to access results of a Pregel job that are only held in memory.
See [Pregel AQL integration](../../data-science/pregel/#aql-integration).

- **handle** (string): the `id` of a Pregel job
- **withId** (bool): if enabled, then the document `_id` is returned in
  addition to the `_key` for each vertex
- returns **results** (array): an array of objects, one element per vertex, with
  the attributes computed by the Pregel algorithm and the document key (and
  optionally identifier)

## Internal functions

The following functions are used during development of ArangoDB as a database
system, primarily for unit testing. They are not intended to be used by end
users, especially not in production environments.

### FAIL()

`FAIL(reason)`

Let a query fail on purpose. Can be used in a conditional branch, or to verify
if lazy evaluation / short circuiting is used for instance.

- **reason** (string): an error message
- returns nothing, because the query is aborted

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN 1 == 1 ? "okay" : FAIL("error") // "okay"
RETURN 1 == 1 || FAIL("error") ? true : false // true
RETURN 1 == 2 && FAIL("error") ? true : false // false
RETURN 1 == 1 && FAIL("error") ? true : false // aborted with error
```
{{% /tab %}}
{{< /tabs >}}

### NOOPT() / NOEVAL()

`NOOPT(value) → retVal`

No-operation that prevents certain query compile-time and run-time optimizations. 
Constant expressions can be forced to be evaluated at runtime with this.
This function is marked as non-deterministic so its argument withstands
query optimization.

`NOEVAL(value) → retVal`

Same as `NOOPT()`, except that it is marked as deterministic.

There is no need to call these functions explicitly, they are mainly used for
internal testing.

- **value** (any): a value of arbitrary type
- returns **retVal** (any): *value*

{{< tabs >}}
{{% tab name="aql" %}}
```aql
// differences in execution plan (explain)
FOR i IN 1..3 RETURN (1 + 1)       // const assignment
FOR i IN 1..3 RETURN NOOPT(1 + 1)  // simple expression
FOR i IN 1..3 RETURN NOEVAL(1 + 1) // simple expression

RETURN NOOPT( 123 ) // evaluates 123 at runtime
RETURN NOOPT( CONCAT("a", "b") ) // evaluates concatenation at runtime
```
{{% /tab %}}
{{< /tabs >}}

### PASSTHRU()

`PASSTHRU(value) → retVal`

Simply returns its call argument unmodified. There is no need to call this function 
explicitly, it is mainly used for internal testing.

- **value** (any): a value of arbitrary type
- returns **retVal** (any): *value*

### SCHEMA_GET()

`SCHEMA_GET(collection) → schema`

Return the schema definition as defined in the properties of the
specified collection.

- **collection** (string): name of a collection
- returns **schema** (object): schema definition object

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN SCHEMA_GET("myColl")
```
{{% /tab %}}
{{< /tabs >}}

### SCHEMA_VALIDATE()

`SCHEMA_VALIDATE(doc, schema) → result`

Test if the given document is valid according to the schema definition.

- **doc** (doc): document
- **schema** (object): schema definition object
- returns **result** (object): an object with the following attributes:
  - **valid** (bool): `true` if the document fulfills the schema's requirements,
    otherwise it will be `false` and *errorMessage* will be set
  - **errorMessage** (string): details about the validation failure

If the input document **doc** is not an object, the function will return
a *null* value and register a warning in the query.

Using an empty **schema** object is equivalent to specifying a **schema**
value of *null*, which will make all input objects successfully pass the 
validation.

### SLEEP()

`SLEEP(seconds) → null`

Wait for a certain amount of time before continuing the query.

- **seconds** (number): amount of time to wait
- returns a *null* value

{{< tabs >}}
{{% tab name="aql" %}}
```aql
SLEEP(1)    // wait 1 second
SLEEP(0.02) // wait 20 milliseconds
```
{{% /tab %}}
{{< /tabs >}}

### V8()

`V8(expression) → retVal`

No-operation that enforces the usage of the V8 JavaScript engine. There is
no need to call this function explicitly, it is mainly used for internal
testing.

- **expression** (any): arbitrary expression
- returns **retVal** (any): the return value of the *expression*

{{< tabs >}}
{{% tab name="aql" %}}
```aql
// differences in execution plan (explain)
FOR i IN 1..3 RETURN (1 + 1)          // const assignment
FOR i IN 1..3 RETURN V8(1 + 1)        // simple expression
```
{{% /tab %}}
{{< /tabs >}}

### VERSION()

`VERSION() → serverVersion`

Returns the server version as a string. In a cluster, returns the version
of the Coordinator.

- returns **serverVersion** (string): the server version string

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN VERSION()        // e.g. "3.10.0" 
```
{{% /tab %}}
{{< /tabs >}}
