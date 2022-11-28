---
fileID: indexing-working-with-indexes
title: Working with Indexes
weight: 645
description: 
layout: default
---
`db._dropIndex(index-handle)`

Drops the index with `index-handle`.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: dropIndex
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("example");
db.example.ensureIndex({ type: "persistent", fields: [ "a", "b" ] });
var indexInfo = db.example.getIndexes();
indexInfo;
db._dropIndex(indexInfo[0])
db._dropIndex(indexInfo[1].id)
indexInfo = db.example.getIndexes();
~db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Revalidating whether an index is used

So you've created an index, and since its maintenance isn't for free,
you definitely want to know whether your query can utilize it.

You can use explain to verify that a certain index is used:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: IndexVerify
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("example");
var explain = require("@arangodb/aql/explainer").explain;
db.example.ensureIndex({ type: "persistent", fields: [ "a", "b" ] });
explain("FOR doc IN example FILTER doc.a < 23 RETURN doc", {colors: false});
~db._drop("example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



(If you omit `colors: false` you will get nice colors in ArangoShell.)
