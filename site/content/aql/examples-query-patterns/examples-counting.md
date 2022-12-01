---
fileID: examples-counting
title: Counting
weight: 3800
description: 
layout: default
---
## Amount of documents in a collection

To return the count of documents that currently exist in a collection,
you can call the [LENGTH() function](../functions/functions-array#length):

{{< tabs >}}
{{% tab name="aql" %}}
```aql
RETURN LENGTH(collection)
```
{{% /tab %}}
{{< /tabs >}}

This type of call is optimized since 2.8 (no unnecessary intermediate result
is built up in memory) and it is therefore the preferred way to determine the count.
Internally, [COLLECTION_COUNT()](../functions/functions-miscellaneous#collection_count) is called.

In earlier versions with `COLLECT ... WITH COUNT INTO` available (since 2.4),
you may use the following code instead of *LENGTH()* for better performance:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN collection
    COLLECT WITH COUNT INTO length
    RETURN length
```
{{% /tab %}}
{{< /tabs >}}
