---
layout: default
description: >-
  You can explain and profile AQL queries to inspect the execution plans and to
  understand the performance characteristics, as well as create debug packages
  for reporting issues
---
Explain AQL Queries
===================

{{ page.description }}
{:class="lead"}

If it is unclear how a given query will perform, clients can retrieve a query's execution plan 
from the AQL query optimizer without actually executing the query. Getting the query execution 
plan from the optimizer is called *explaining*.

An explain throws an error if the given query is syntactically invalid. Otherwise, it
returns the execution plan and some information about what optimizations could be applied to
the query. The query is not executed.

You can explain a query using the [HTTP REST API](../http/aql-query.html#explain-an-aql-query)
or via _arangosh_.

Inspecting query plans
----------------------

The `explain()` method of an `ArangoStatement` (`db._createStatement(...).explain()`)
creates very verbose output. To get a human-readable output of the query plan,
you can use `db._explain()`. You can use it as follows (without disabling syntax
highlighting with `{ colors: false }`):

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 01_workWithAQL_databaseExplain
    @EXAMPLE_ARANGOSH_OUTPUT{01_workWithAQL_databaseExplain}
      db._explain("LET s = SLEEP(0.25) LET t = SLEEP(0.5) RETURN 1", {}, {colors: false});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 01_workWithAQL_databaseExplain
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

The plan contains all execution nodes that are used during a query. These nodes represent different
stages in a query. Each stage gets the input from the stage directly above (its dependencies). 
The plan shows you the estimated number of items (results) for each query stage (under **Est.**). Each
query stage roughly equates to a line in your original query, which you can see under **Comment**.

Profiling queries
-----------------

Sometimes when you have a complex query it can be unclear on what time is spent
during the execution, even for intermediate ArangoDB users.

By profiling a query it gets executed with special instrumentation code enabled.
It gives you all the usual information like when explaining a query, but
additionally you get the query profile, [runtime statistics](execution-and-performance-query-statistics.html)
and per-node statistics.

To use this in an interactive fashion in the shell, you can call
`db._profileQuery()`, or use the web interface. You can use `db._profileQuery()`
as follows (without disabling syntax highlighting with `{ colors: false }`):

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 01_workWithAQL_databaseProfileQuery
    @EXAMPLE_ARANGOSH_OUTPUT{01_workWithAQL_databaseProfileQuery}
      db._profileQuery("LET s = SLEEP(0.25) LET t = SLEEP(0.5) RETURN 1", {}, {colors: false});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 01_workWithAQL_databaseProfileQuery
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

For more information, see [Profiling Queries](execution-and-performance-query-profiler.html).

Execution plans in detail
-------------------------

By default, the query optimizer returns what it considers to be the *optimal plan*. The
optimal plan is returned in the `plan` attribute of the result. If `explain` is
called with the `allPlans` option set to `true`, all plans are returned in the `plans`
attribute.

The result object also contains a `warnings` attribute, which is an array of
warnings that occurred during optimization or execution plan creation.

Each plan in the result is an object with the following attributes:
- `nodes`: the array of execution nodes of the plan. See the list of
  [execution nodes](execution-and-performance-optimizer.html#execution-nodes)
- `estimatedCost`: the total estimated cost for the plan. If there are multiple
  plans, the optimizer chooses the plan with the lowest total cost.
- `collections`: an array of collections used in the query
- `rules`: an array of rules the optimizer applied. See the list of
  [optimizer rules](execution-and-performance-optimizer.html#optimizer-rules)
- `variables`: array of variables used in the query (note: this may contain
  internal variables created by the optimizer)

Here is an example for retrieving the execution plan of a simple query:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 07_workWithAQL_statementsExplain
    @EXAMPLE_ARANGOSH_OUTPUT{07_workWithAQL_statementsExplain}
      var stmt = db._createStatement("FOR user IN _users RETURN user");
      stmt.explain();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 07_workWithAQL_statementsExplain
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

As the output of `explain()` is very detailed, it is recommended to use some
scripting to make the output less verbose:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 08_workWithAQL_statementsPlans
    @EXAMPLE_ARANGOSH_OUTPUT{08_workWithAQL_statementsPlans}
    | var formatPlan = function (plan) {
    |   return { estimatedCost: plan.estimatedCost,
    |     nodes: plan.nodes.map(function(node) {
            return node.type; }) }; };
      formatPlan(stmt.explain().plan);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 08_workWithAQL_statementsPlans
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

If a query contains bind parameters, they must be added to the statement **before**
`explain()` is called:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 09_workWithAQL_statementsPlansBind
    @EXAMPLE_ARANGOSH_OUTPUT{09_workWithAQL_statementsPlansBind}
    | var stmt = db._createStatement(
    |   `FOR doc IN @@collection FILTER doc.user == @user RETURN doc`
      );
    stmt.bind({ "@collection" : "_users", "user" : "root" });
    stmt.explain();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 09_workWithAQL_statementsPlansBind
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

In some cases, the AQL optimizer creates multiple plans for a single query. By default
only the plan with the lowest total estimated cost is kept, and the other plans are
discarded. To retrieve all plans the optimizer has generated, `explain` can be called
with the option `allPlans` set to `true`.

In the following example, the optimizer has created two plans:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 10_workWithAQL_statementsPlansOptimizer0
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_statementsPlansOptimizer0}
    | var stmt = db._createStatement(
        "FOR user IN _users FILTER user.user == 'root' RETURN user");
      stmt.explain({ allPlans: true }).plans.length;
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_statementsPlansOptimizer0
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

To see a slightly more compact version of the plan, the following
transformation can be applied:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 10_workWithAQL_statementsPlansOptimizer1
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_statementsPlansOptimizer1}
    ~ var stmt = db._createStatement("FOR user IN _users FILTER user.user == 'root' RETURN user");
    | stmt.explain({ allPlans: true }).plans.map(
        function(plan) { return formatPlan(plan); });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_statementsPlansOptimizer1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

`explain()` also accepts the following additional options:
- `maxPlans`: limits the maximum number of plans that are created by the AQL query optimizer
- `optimizer`:
  - `rules`: an array of to-be-included or to-be-excluded optimizer rules
    can be put into this attribute, telling the optimizer to include or exclude
    specific rules. To disable a rule, prefix its name with a `-`, to enable a rule, prefix it
    with a `+`. There is also a pseudo-rule `all`, which matches all optimizer rules.

The following example disables all optimizer rules but `remove-redundant-calculations`:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 10_workWithAQL_statementsPlansOptimizer2
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_statementsPlansOptimizer2}
    ~ var stmt = db._createStatement("FOR user IN _users FILTER user.user == 'root' RETURN user");
    | stmt.explain({ optimizer: {
        rules: [ "-all", "+remove-redundant-calculations" ] } });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_statementsPlansOptimizer2
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

The contents of an execution plan are meant to be machine-readable. To get a human-readable
version of a query's execution plan, the following commands can be used
(without disabling syntax highlighting with `{ colors: false }`):

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 10_workWithAQL_statementsPlansOptimizer3
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_statementsPlansOptimizer3}
      var query = "FOR doc IN mycollection FILTER doc.value > 42 RETURN doc";
      require("@arangodb/aql/explainer").explain(query, {colors:false});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_statementsPlansOptimizer3
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

The above command prints the query's execution plan in the ArangoShell
directly, focusing on the most important information.

Gathering debug information about a query
-----------------------------------------

If an explain provides no suitable insight into why a query does not perform as
expected, it may be reported to the ArangoDB support. In order to make this as easy
as possible, there is a built-in command in ArangoShell for packaging the query, its
bind parameters, and all data required to execute the query elsewhere.

`require("@arangodb/aql/explainer").debugDump(filepath, query[, bindVars[, options]])`

You can specify the following parameters:

- `filepath` (string): A file path to save the debug package to
- `query` (string): An AQL query
- `bindVars` (object, _optional_): The bind parameters for the query
- `options` (object, _optional_): Options for the query, with two additionally
  supported settings compared to `db._query()`:
  - `examples` (number, _optional_): How many sample documents of your
    collection data to include. Default: `0`
  - `anonymize` (boolean, _optional_): Whether all string attribute values of
    the sample documents shall be substituted with strings like `XXX`.

The command stores all data in a file with a configurable filename:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline 10_workWithAQL_debugging1
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_debugging1}
      var query = "FOR doc IN mycollection FILTER doc.value > 42 RETURN doc";
      require("@arangodb/aql/explainer").debugDump("/tmp/query-debug-info", query);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_debugging1
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

Entitled users can send the generated file to the ArangoDB support to facilitate 
reproduction and debugging.

{% hint 'tip' %}
You can also create debug packages using the web interface, see
[Query debug packages](../troubleshooting-query-debug-packages.html).
{% endhint %}

If a query contains bind parameters, you need to specify them along with the query
string:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}    
    @startDocuBlockInline 10_workWithAQL_debugging2
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_debugging2}
      var query = "FOR doc IN @@collection FILTER doc.value > @value RETURN doc";
      var bindVars = { value: 42, "@collection": "mycollection" };
      require("@arangodb/aql/explainer").debugDump("/tmp/query-debug-info", query, bindVars);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_debugging2
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

It is also possible to include example documents from the underlying collection in
order to make reproduction even easier. Example documents can be sent as they are, or
in an anonymized form. The number of example documents can be specified in the `examples`
options attribute, and should generally be kept low. The `anonymize` option replaces
the contents of string attributes in the examples with `XXX`. However, it does not 
replace any other types of data (e.g. numeric values) or attribute names. Attribute
names in the examples are always preserved because they may be indexed and used in
queries:

    {% arangoshexample examplevar="examplevar" script="script" result="result" %}    
    @startDocuBlockInline 10_workWithAQL_debugging3
    @EXAMPLE_ARANGOSH_OUTPUT{10_workWithAQL_debugging3}
      var query = "FOR doc IN @@collection FILTER doc.value > @value RETURN doc";
      var bind = { value: 42, "@collection": "mycollection" };
      var options = { examples: 10, anonymize: true };
      require("@arangodb/aql/explainer").debugDump("/tmp/query-debug-info", query, bind, options);
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock 10_workWithAQL_debugging3
    {% endarangoshexample %}
    {% include arangoshexample.html id=examplevar script=script result=result %}

To get a human-readable output from a debug package JSON file, you can use the
`inspectDump()` method:

`require("@arangodb/aql/explainer").inspectDump(inFilepath[, outFilepath])`

You can specify the following parameters:

- `inFilepath` (string): The path to the debug package JSON file
- `outFilepath` (string, _optional_): A path to store the formatted output in a
  file instead of printing to the shell
