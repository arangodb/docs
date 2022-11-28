---
fileID: execution-and-performance-explaining-queries
title: Explaining queries
weight: 3895
description: 
layout: default
---
If it is unclear how a given query will perform, clients can retrieve a query's execution plan 
from the AQL query optimizer without actually executing the query. Getting the query execution 
plan from the optimizer is called *explaining*.

An explain will throw an error if the given query is syntactically invalid. Otherwise, it will
return the execution plan and some information about what optimizations could be applied to
the query. The query will not be executed.

Explaining a query can be achieved by calling the [HTTP REST API](../../http/aql-query)
or via _arangosh_.
A query can also be explained from the ArangoShell using the `ArangoDatabase`'s `explain` method
or in detail via `ArangoStatement`'s `explain` method.


## Inspecting query plans

The `explain` method of `ArangoStatement` as shown in the next chapters creates very verbose output.
To get a human-readable output of the query plan you can use the `explain` method on our database
object in arangosh. You may use it like this: (we disable syntax highlighting here)


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 01_workWithAQL_databaseExplain
description: ''
render: input/output
version: '3.10'
release: stable
---
db._explain("LET s = SLEEP(0.25) LET t = SLEEP(0.5) RETURN 1", {}, {colors: false});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



The plan contains all execution nodes that are used during a query. These nodes represent different
stages in a query. Each stage gets the input from the stage directly above (its dependencies). 
The plan will show you the estimated number of items (results) for each query stage (under _Est._). Each
query stage roughly equates to a line in your original query, which you can see under _Comment_.


## Profiling queries

Sometimes when you have a complex query it can be unclear on what time is spent
during the execution, even for intermediate ArangoDB users.

By profiling a query it gets executed with special instrumentation code enabled.
It gives you all the usual information like when explaining a query, but
additionally you get the query profile, [runtime statistics](execution-and-performance-query-statistics)
and per-node statistics.

To use this in an interactive fashion on the shell you can use the
`_profileQuery()` method on the `ArangoDatabase` object or use the web interface.

For more information see [Profiling Queries](execution-and-performance-query-profiler).


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 01_workWithAQL_databaseProfileQuery
description: ''
render: input/output
version: '3.10'
release: stable
---
db._profileQuery("LET s = SLEEP(0.25) LET t = SLEEP(0.5) RETURN 1", {}, {colors: false});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## Execution plans in detail

By default, the query optimizer will return what it considers to be the *optimal plan*. The
optimal plan will be returned in the `plan` attribute of the result. If `explain` is
called with option `allPlans` set to `true`, all plans will be returned in the `plans`
attribute instead. The result object will also contain an attribute *warnings*, which 
is an array of warnings that occurred during optimization or execution plan creation.

Each plan in the result is an object with the following attributes:
- *nodes*: the array of execution nodes of the plan. See the
  [list of execution nodes](execution-and-performance-optimizer#list-of-execution-nodes)
- *estimatedCost*: the total estimated cost for the plan. If there are multiple
  plans, the optimizer will choose the plan with the lowest total cost.
- *collections*: an array of collections used in the query
- *rules*: an array of rules the optimizer applied. See the
  [list of optimizer rules](execution-and-performance-optimizer#list-of-optimizer-rules)
- *variables*: array of variables used in the query (note: this may contain
  internal variables created by the optimizer)

Here is an example for retrieving the execution plan of a simple query:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 07_workWithAQL_statementsExplain
description: ''
render: input/output
version: '3.10'
release: stable
---
 var stmt = db._createStatement(
 "FOR user IN _users RETURN user");
stmt.explain();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



As the output of `explain` is very detailed, it is recommended to use some
scripting to make the output less verbose:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 08_workWithAQL_statementsPlans
description: ''
render: input/output
version: '3.10'
release: stable
---
 var formatPlan = function (plan) {
 return { estimatedCost: plan.estimatedCost,
 nodes: plan.nodes.map(function(node) {
return node.type; }) }; };
formatPlan(stmt.explain().plan);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



If a query contains bind parameters, they must be added to the statement **before**
`explain` is called:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 09_workWithAQL_statementsPlansBind
description: ''
render: input/output
version: '3.10'
release: stable
---
 var stmt = db._createStatement(
  `FOR doc IN @@collection FILTER doc.user == @user RETURN doc`
);
stmt.bind({ "@collection" : "_users", "user" : "root" });
stmt.explain();
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



In some cases the AQL optimizer creates multiple plans for a single query. By default
only the plan with the lowest total estimated cost is kept, and the other plans are
discarded. To retrieve all plans the optimizer has generated, `explain` can be called
with the option `allPlans` set to `true`.

In the following example, the optimizer has created two plans:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_statementsPlansOptimizer0
description: ''
render: input/output
version: '3.10'
release: stable
---
 var stmt = db._createStatement(
  "FOR user IN _users FILTER user.user == 'root' RETURN user");
stmt.explain({ allPlans: true }).plans.length;
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



To see a slightly more compact version of the plan, the following
transformation can be applied:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_statementsPlansOptimizer1
description: ''
render: input/output
version: '3.10'
release: stable
---
~var stmt = db._createStatement("FOR user IN _users FILTER user.user == 'root' RETURN user");
 stmt.explain({ allPlans: true }).plans.map(
function(plan) { return formatPlan(plan); });
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



`explain` will also accept the following additional options:
- *maxPlans*: limits the maximum number of plans that are created by the AQL query optimizer
- *optimizer.rules*: an array of to-be-included or to-be-excluded optimizer rules
  can be put into this attribute, telling the optimizer to include or exclude
  specific rules. To disable a rule, prefix its name with a `-`, to enable a rule, prefix it
  with a `+`. There is also a pseudo-rule `all`, which will match all optimizer rules.

The following example disables all optimizer rules but `remove-redundant-calculations`:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_statementsPlansOptimizer2
description: ''
render: input/output
version: '3.10'
release: stable
---
~var stmt = db._createStatement("FOR user IN _users FILTER user.user == 'root' RETURN user");
 stmt.explain({ optimizer: {
   rules: [ "-all", "+remove-redundant-calculations" ] } });
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



The contents of an execution plan are meant to be machine-readable. To get a human-readable
version of a query's execution plan, the following commands can be used:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_statementsPlansOptimizer3
description: ''
render: input/output
version: '3.10'
release: stable
---
var query = "FOR doc IN mycollection FILTER doc.value > 42 RETURN doc";
require("@arangodb/aql/explainer").explain(query, {colors:false});
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



The above command prints the query's execution plan in the ArangoShell
directly, focusing on the most important information.

## Gathering debug information about a query

If an explain provides no suitable insight into why a query does not perform as
expected, it may be reported to the ArangoDB support. In order to make this as easy
as possible, there is a built-in command in ArangoShell for packaging the query, its
bind parameters and all data required to execute the query elsewhere.

The command will store all data in a file with a configurable filename:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_debugging1
description: ''
render: input/output
version: '3.10'
release: stable
---
var query = "FOR doc IN mycollection FILTER doc.value > 42 RETURN doc";
require("@arangodb/aql/explainer").debugDump("/tmp/query-debug-info", query);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Entitled users can send the generated file to the ArangoDB support to facilitate 
reproduction and debugging.

If a query contains bind parameters, they will need to specified along with the query
string:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_debugging2
description: ''
render: input/output
version: '3.10'
release: stable
---
var query = "FOR doc IN @@collection FILTER doc.value > @value RETURN doc";
var bind = { value: 42, "@collection": "mycollection" };
require("@arangodb/aql/explainer").debugDump("/tmp/query-debug-info", query, bind);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



It is also possible to include example documents from the underlying collection in
order to make reproduction even easier. Example documents can be sent as they are, or
in an anonymized form. The number of example documents can be specified in the *examples*
options attribute, and should generally be kept low. The *anonymize* option will replace
the contents of string attributes in the examples with "XXX". It will however not 
replace any other types of data (e.g. numeric values) or attribute names. Attribute
names in the examples will always be preserved because they may be indexed and used in
queries:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: 10_workWithAQL_debugging3
description: ''
render: input/output
version: '3.10'
release: stable
---
var query = "FOR doc IN @@collection FILTER doc.value > @value RETURN doc";
var bind = { value: 42, "@collection": "mycollection" };
var options = { examples: 10, anonymize: true };
require("@arangodb/aql/explainer").debugDump("/tmp/query-debug-info", query, bind, options);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


