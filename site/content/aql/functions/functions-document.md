---
fileID: functions-document
title: Document functions
weight: 3885
description: 
layout: default
---
`UNSET_RECURSIVE(document, attributeNameArray) → doc`

- **document** (object): a document / object
- **attributeNameArray** (array): an array of attribute names as strings
- returns **doc** (object): *document* without the specified attributes at
  all levels (top-level as well as nested objects)

**Examples**

Recursively remove `baz` attributes, by passing an array with the attribute key:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlUnsetRecursive_7
description: ''
render: input/output
version: '3.10'
release: stable
---
LET doc = { foo: { bar: { foo: 1, baz: 2 }, baz: 3 }, baz: 4 }
RETURN UNSET_RECURSIVE(doc, ["baz"])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## VALUE()

`VALUE(document, path) → value`

Return the specified attribute value of the `document`.

- **document** (object): a document / object
- **path** (array): an array of strings and numbers that describes the
  attribute path. You can select object keys with strings and array elements
  with numbers.
- returns **value** (any): the selected value of `document`

**Examples**

Dynamically get the inner string, like `obj.foo.bar` would:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlValue_1
description: ''
render: input/output
version: '3.10'
release: stable
---
  LET obj = { foo: { bar: "baz" } }
  RETURN VALUE(obj, ["foo", "bar"])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Dynamically get the inner object of the second array element of a top-level
attribute, like `obj.foo[1].bar` would:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlValue_2
description: ''
render: input/output
version: '3.10'
release: stable
---
  LET obj = { foo: [ { bar: "baz" }, { bar: { inner: true } } ] }
  RETURN VALUE(obj, ["foo", 1, "bar"])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## VALUES()

`VALUES(document, removeInternal) → anyArray`

Return the attribute values of the `document` as an array. Optionally omit
system attributes.

- **document** (object): a document / object
- **removeInternal** (bool, *optional*): if set to `true`, then all internal attributes
  (such as `_id`, `_key` etc.) are removed from the result
- returns **anyArray** (array): the values of `document` returned in any order

**Examples**

Get the attribute values of an object:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlValues_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN VALUES( { "_id": "users/jane", "name": "Jane", "age": 35 } )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

Get the attribute values of an object, omitting system attributes:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlValues_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN VALUES( { "_id": "users/jane", "name": "Jane", "age": 35 }, true )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

## ZIP()

`ZIP(keys, values) → doc`

Return a document object assembled from the separate parameters `keys` and `values`.

`keys` and `values` must be arrays and have the same length.

- **keys** (array): an array of strings, to be used as attribute names in the result
- **values** (array): an array with elements of arbitrary types, to be used as
  attribute values
- returns **doc** (object): a document with the keys and values assembled

**Examples**

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlZip
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN ZIP( [ "name", "active", "hobbies" ], [ "some user", true, [ "swimming", "riding" ] ] )
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    
