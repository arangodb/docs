---
fileID: invocation-with-web-interface
title: AQL with ArangoDB Web Interface
weight: 3540
description: 
layout: default
---
In the ArangoDB Web Interface the AQL Editor tab allows to execute ad-hoc AQL
queries.

Type in a query in the main box and execute it by pressing the *Execute* button.
The query result will be shown in another tab. The editor provides a few example
queries that can be used as templates.

It also provides a feature to explain a query and inspect its execution plan
(with the *Explain* button). 

Bind parameters can be defined in the right-hand side pane. The format is the
same as used for bind parameters in the HTTP REST API and in (JavaScript)
application code.
 
Here is an example: 

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN @@collection
  FILTER CONTAINS(LOWER(doc.author), @search, false)
  RETURN { "name": doc.name, "descr": doc.description, "author": doc.author }
```
{{% /tab %}}
{{< /tabs >}}

Bind parameters (table view mode):

| Key         | Value  |
|-------------|--------|
| @collection | _apps  |
| search      | arango |

Bind parameters (JSON view mode):

{{< tabs >}}
{{% tab name="json" %}}
```json
{
    "@collection": "_apps",
    "search": "arango"
}
```
{{% /tab %}}
{{< /tabs >}}

How bind parameters work can be found in [AQL Fundamentals](../aql-fundamentals/fundamentals-bind-parameters).

Queries can also be saved in the AQL editor along with their bind parameter values
for later reuse. This data is stored in the user profile in the current database
(in the *_users* system table). 

Also see the detailed description of the [Web Interface](../../programs-tools/web-interface/).
