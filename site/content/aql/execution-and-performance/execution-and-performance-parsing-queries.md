---
fileID: execution-and-performance-parsing-queries
title: Parsing queries
weight: 3890
description: 
layout: default
---
    
Clients can use ArangoDB to check if a given AQL query is syntactically valid. ArangoDB provides
an [HTTP REST API](../../http/aql-query) for this. 

A query can also be parsed from the ArangoShell using `ArangoStatement`'s `parse` method. The
`parse` method will throw an exception if the query is syntactically invalid. Otherwise, it will
return the some information about the query.

The return value is an object with the collection names used in the query listed in the
`collections` attribute, and all bind parameters listed in the `bindVars` attribute.
Additionally, the internal representation of the query, the query's abstract syntax tree, will
be returned in the `AST` attribute of the result. Please note that the abstract syntax tree
will be returned without any optimizations applied to it.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 11_workWithAQL_parseQueries
description: ''
render: input/output
version: '3.10'
release: stable
---
 var stmt = db._createStatement(
  "FOR doc IN @@collection FILTER doc.foo == @bar RETURN doc");
stmt.parse();
~removeIgnoreCollection("mycollection")
~db._drop("mycollection")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 

