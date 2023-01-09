---
fileID: data-modeling-documents-document-methods
title: Collection Methods
weight: 80
description: 
layout: default
---
`edge-collection.outEdges(vertices)`

The `outEdges()` operator finds all edges starting from (outbound) a document
from `vertices`, which must a list of documents or document handles.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: EDGCOL_02_outEdges
description: ''
render: input/output
version: '3.10'
release: stable
---
  db._create("vertex");
  db._createEdgeCollection("relation");
~ var myGraph = {};
  myGraph.v1 = db.vertex.insert({ name : "vertex 1" });
  myGraph.v2 = db.vertex.insert({ name : "vertex 2" });
  myGraph.e1 = db.relation.insert(myGraph.v1, myGraph.v2,
  { label : "knows"});
  db._document(myGraph.e1);
  db.relation.outEdges(myGraph.v1._id);
  db.relation.outEdges(myGraph.v2._id);
~ db._drop("relation");
~ db._drop("vertex");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Misc

`collection.iterate(iterator, options)`

Iterates over some elements of the collection and apply the function
`iterator` to the elements. The function will be called with the
document as first argument and the current number (starting with 0)
as second argument.

`options` must be an object with the following attributes:

  - `limit` (optional, default none): use at most `limit` documents.

  - `probability` (optional, default all): a number between `0` and
    `1`. Documents are chosen with this probability.

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: accessViaGeoIndex
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("example")
 for (i = -90;  i <= 90;  i += 10) {
   for (j = -180;  j <= 180;  j += 10) {
 db.example.insert({ name : "Name/" + i + "/" + j,
   home : [ i, j ],
   work : [ -i, -j ] });
   }
 }
 db.example.ensureIndex({ type: "geo", fields: [ "home" ] });
  items = db.example.getIndexes().map(function(x) { return x.id; });
 db.example.index(items[1]);
~ db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


