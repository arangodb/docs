---
fileID: examples-queries-no-collections
title: Queries without collections
weight: 4030
description: 
layout: default
---
AQL queries typically access one or more collections to read from documents
or to modify them. Queries don't necessarily have to involve collections
however. Below are a few examples of that.

Following is a query that returns a string value. The result string is contained in an array
because the result of every valid query is an array:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlWithoutCollections_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN "this will be returned"
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





You may use variables, call functions and return arbitrarily structured results:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlWithoutCollections_2
description: ''
render: input/output
version: '3.10'
release: stable
---
LET array = [1, 2, 3, 4]
RETURN { array, sum: SUM(array) }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





Language constructs such as the FOR loop can be used too. Below query
creates the Cartesian product of two arrays and concatenates the value pairs:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlWithoutCollections_3
description: ''
render: input/output
version: '3.10'
release: stable
---
FOR year IN [ 2011, 2012, 2013 ]
  FOR quarter IN [ 1, 2, 3, 4 ]
RETURN {
  year,
  quarter,
  formatted: CONCAT(quarter, " / ", year)
}
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}




