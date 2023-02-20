---
layout: default
description: AQL queries are sent through an optimizer before execution
---
The AQL query optimizer
=======================

AQL queries are sent through an optimizer before execution. The task of the optimizer is
to create an initial execution plan for the query, look for optimization opportunities and
apply them. As a result, the optimizer might produce multiple execution plans for a
single query. It then calculates the costs for all plans and picks the plan with the
lowest total cost. This resulting plan is considered to be the *optimal plan*, which is
then executed.

The optimizer is designed to only perform optimizations if they are *safe*, in the
sense that an optimization should not modify the result of a query. A notable exception
to this is that the optimizer is allowed to change the order of results for queries that
do not explicitly specify how results should be sorted.

Execution plans
---------------

The `explain` command can be used to query the optimal executed plan or even all plans
the optimizer has generated. Additionally, `explain` can reveal some more information
about the optimizer's view of the query.

### Inspecting plans using the explain helper

The `explain` method of `ArangoStatement` as shown in the next chapters creates very verbose output.
You can work on the output programmatically, or use this handsome tool that we created
to generate a more human readable representation.

You may use it like this: (we disable syntax highlighting here)

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_01_axplainer
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_01_axplainer}
    ~addIgnoreCollection("test")
    ~db._drop("test");
    db._create("test");
    for (i = 0; i < 100; ++i) { db.test.save({ value: i }); }
    db.test.ensureIndex({ type: "persistent", fields: [ "value" ] });
    var explain = require("@arangodb/aql/explainer").explain;
    explain("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value", {colors:false});
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_01_axplainer
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Execution plans in detail

Let's have a look at the raw json output of the same execution plan
using the `explain` method of `ArangoStatement`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_01_explainCreate
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_01_explainCreate}
    stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_01_explainCreate
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

As you can see, the result details are very verbose. They are not covered in
detail for brevity in the next sections. Instead, let's take a closer look at
the results step by step.

#### Execution nodes

In general, an execution plan can be considered to be a pipeline of processing steps.
Each processing step is carried out by a so-called *execution node*

The `nodes` attribute of the `explain` result contains these *execution nodes* in
the *execution plan*. The output is still very verbose, so here's a shorted form of it:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_02_explainOverview
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_02_explainOverview}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain().plan.nodes.map(function (node) { return node.type; });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_02_explainOverview
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

*Note that the list of nodes might slightly change in future versions of ArangoDB if
new execution node types get added or the optimizer create somewhat more
optimized plans).*

When a plan is executed, the query execution engine starts with the node at
the bottom of the list (i.e. the `ReturnNode`).

The `ReturnNode`'s purpose is to return data to the caller. It does not produce
data itself, but it asks the node above itself, which is the `CalculationNode`
in our example.
`CalculationNode`s are responsible for evaluating arbitrary expressions. In our
example query, the `CalculationNode` evaluates the value of `i.value`, which
is needed by the `ReturnNode`. The calculation is applied for all data the
`CalculationNode` gets from the node above it, in our example the `IndexNode`.

Finally, all of this needs to be done for documents of collection `test`. This is
where the `IndexNode` enters the game. It uses an index (thus its name)
to find certain documents in the collection and ships it down the pipeline in the
order required by `SORT i.value`. The `IndexNode` itself has a `SingletonNode`
as its input. The sole purpose of a `SingletonNode` node is to provide a single empty
document as input for other processing steps. It is always the end of the pipeline.

Here is a summary:
- SingletonNode: produces an empty document as input for other processing steps.
- IndexNode: iterates over the index on attribute `value` in collection `test`
  in the order required by `SORT i.value`.
- CalculationNode: evaluates the result of the calculation `i.value > 97` to `true` or `false`
- CalculationNode: calculates return value `i.value`
- ReturnNode: returns data to the caller

#### Optimizer rules

Note that in the example, the optimizer has optimized the `SORT` statement away.
It can do it safely because there is a sorted persistent index on `i.value`, which it has
picked in the `IndexNode`. As the index values are iterated over in sorted order
anyway, the extra `SortNode` would have been redundant and was removed.

Additionally, the optimizer has done more work to generate an execution plan that
avoids as much expensive operations as possible. Here is the list of optimizer rules
that were applied to the plan:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_03_explainRules
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_03_explainRules}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain().plan.rules;
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_03_explainRules
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Here is the meaning of these rules in context of this query:
- `move-calculations-up`: Moves a `CalculationNode` and subqueries, when independent from the outer node, 
   as far up in the processing pipeline as possible.
- `move-filters-up`: Moves a `FilterNode` as far up in the processing pipeline as
  possible.
- `remove-redundant-calculations`: Replaces references to variables with references to
  other variables that contain the exact same result. In the example query, `i.value`
  is calculated multiple times, but each calculation inside a loop iteration would
  produce the same value. Therefore, the expression result is shared by several nodes.
- `remove-unnecessary-calculations`: Removes `CalculationNode`s whose result values are
  not used in the query. In the example this happens due to the `remove-redundant-calculations`
  rule having made some calculations unnecessary.
- `use-indexes`: Use an index to iterate over a collection instead of performing a
  full collection scan. In the example case this makes sense, as the index can be
  used for filtering and sorting.
- `remove-filter-covered-by-index`: Remove an unnecessary filter whose functionality
  is already covered by an index. In this case the index only returns documents 
  matching the filter.
- `use-index-for-sort`: Removes a `SORT` operation if it is already satisfied by
  traversing over a sorted index.

Note that some rules may appear multiple times in the list, with number suffixes.
This is due to the same rule being applied multiple times, at different positions
in the optimizer pipeline.

Also see the full [List of optimizer rules](#list-of-optimizer-rules) below.

#### Collections used in a query

The list of collections used in a plan (and query) is contained in the `collections`
attribute of a plan:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_04_explainCollections
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_04_explainCollections}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain().plan.collections
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_04_explainCollections
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The `name` attribute contains the name of the `collection`, and `type` is the
access type, which can be either `read` or `write`.

#### Variables used in a query

The optimizer returns a list of variables used in a plan (and query). This
list contains auxiliary variables created by the optimizer itself. You can
ignore this list in most cases.

#### Cost of a query

For each plan the optimizer generates, it calculates the total cost. The plan
with the lowest total cost is considered to be the optimal plan. Costs are
estimates only, as the actual execution costs are unknown to the optimizer.
Costs are calculated based on heuristics that are hard-coded into execution nodes.
Cost values do not have any unit.

### Retrieving all execution plans

To retrieve not just the optimal plan but a list of all plans the optimizer has
generated, set the option `allPlans` to `true`:

This returns a list of all plans in the `plans` attribute instead of in the
`plan` attribute:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_05_explainAllPlans
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_05_explainAllPlans}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain({ allPlans: true });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_05_explainAllPlans
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Retrieving the plan as it was generated by the parser / lexer

To retrieve the plan which closely matches your query, you may turn off most
optimization rules (i.e. cluster rules cannot be disabled if you're running
the explain on a cluster Coordinator) set the option `rules` to `-all`:

This returns an unoptimized plan in the `plan`:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_06_explainUnoptimizedPlans
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_06_explainUnoptimizedPlans}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain({ optimizer: { rules: [ "-all" ] } });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_06_explainUnoptimizedPlans
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Note that some optimizations are already done at parse time (i.e. evaluate simple constant
calculation as `1 + 1`)

Turning specific optimizer rules off
------------------------------------

Optimizer rules can also be turned on or off individually, using the `rules` attribute.
This can be used to enable or disable one or multiple rules. Rules that shall be enabled
need to be prefixed with a `+`, rules to be disabled should be prefixed with a `-`. The
pseudo-rule `all` matches all rules.

Rules specified in `rules` are evaluated from left to right, so the following works to
turn on just the one specific rule:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_07_explainSingleRulePlans
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_07_explainSingleRulePlans}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain({ optimizer: { rules: [ "-all", "+use-index-range" ] } });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_07_explainSingleRulePlans
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

By default, all rules are turned on. To turn off just a few specific rules, use something
like this:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_08_explainDisableSingleRulePlans
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_08_explainDisableSingleRulePlans}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain({ optimizer: { rules: [ "-use-index-range", "-use-index-for-sort" ] } });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_08_explainDisableSingleRulePlans
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The maximum number of plans created by the optimizer can also be limited using the
`maxNumberOfPlans` attribute:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_09_explainMaxNumberOfPlans
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_09_explainMaxNumberOfPlans}
    ~var stmt = db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value");
    stmt.explain({ maxNumberOfPlans: 1 });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_09_explainMaxNumberOfPlans
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Optimizer statistics
--------------------

The optimizer provides statistics as a part of an `explain` result.
The following attributes are returned in the `stats` attribute:

- `plansCreated`: The total number of plans created by the optimizer.
- `rulesExecuted`: The number of rules executed. Note that an executed rule does
  not indicate that a plan has actually been modified by a rule.
- `rulesSkipped`: The number of rules skipped by the optimizer.
- `executionTime`: The (wall-clock) time in seconds needed to explain the query.
- `peakMemoryUsage`: The maximum memory usage of the query during explain.

Warnings
--------

For some queries, the optimizer may produce warnings. These are returned in
the `warnings` attribute of the `explain` result:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline AQLEXP_10_explainWarn
    @EXAMPLE_ARANGOSH_OUTPUT{AQLEXP_10_explainWarn}
    var stmt = db._createStatement("FOR i IN 1..10 RETURN 1 / 0")
    stmt.explain().warnings;
    ~db._drop("test")
    ~removeIgnoreCollection("test")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock AQLEXP_10_explainWarn
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

There is an upper bound on the number of warnings a query may produce. If that
bound is reached, no further warnings are returned.

Optimization in a cluster
-------------------------

When you are running AQL in the cluster, the parsing of the query is done on the
Coordinator. The Coordinator then chops the query into snippets, which are either
to remain on the Coordinator or need to be distributed to the shards on the
DB-Servers over the network. The cutting sites are interconnected via `ScatterNode`s,
`GatherNode`s and `RemoteNode`s. These nodes mark the network borders of the snippets.

The optimizer strives to reduce the amount of data transferred via these network
interfaces by pushing `FILTER`s out to the shards, as it is vital to the query
performance to reduce that data amount to transfer over the network links.

{% hint 'info' %}
Some hops between Coordinators and DB-Servers are unavoidable. An example are
[user-defined functions](extending.html) (UDFs), which have to be executed on
the Coordinator. If you cannot modify your query to have a lower amount of
back and forth between sites, then try to lower the amount of data that has
to be transferred between them. In case of UDFs, use effective FILTERs before
calling them.
{% endhint %}

Using a cluster, there is a **Site** column if you explain a query.
Snippets marked with **DBS** are executed on DB-Servers, **COOR** ones are
executed on the respective Coordinator.

```aql
Query String (57 chars, cacheable: false):
 FOR doc IN test UPDATE doc WITH { updated: true } IN test

Execution plan:
 Id   NodeType          Site     Est.   Comment
  1   SingletonNode     DBS         1   * ROOT
  3   CalculationNode   DBS         1     - LET #3 = { "updated" : true }   
 13   IndexNode         DBS   1000000     - FOR doc IN test   /* primary index scan, index only, projections: `_key`, 5 shard(s) */    
  4   UpdateNode        DBS         0       - UPDATE doc WITH #3 IN test 
  7   RemoteNode        COOR        0       - REMOTE
  8   GatherNode        COOR        0       - GATHER 
```

List of execution nodes
-----------------------

The following execution node types appear in the output of `explain`:

- **CalculationNode**:
  Evaluates an expression. The expression result may be used by
  other nodes, e.g. `FilterNode`, `EnumerateListNode`, `SortNode` etc.

- **CollectNode**:
  Aggregates its input and produces new output variables. This appears
  once per `COLLECT` statement.

- **EnumerateCollectionNode**:
  Enumeration over documents of a collection (given in its *collection*
  attribute) without using an index.

- **EnumerateListNode**:
  Enumeration over a list of (non-collection) values.

- **EnumerateViewNode**:
  Enumeration over documents of a View.

- **FilterNode**:
  Only lets values pass that satisfy a filter condition. Appears once
  per `FILTER` statement.

- **IndexNode**:
  Enumeration over one or many indexes (given in its *indexes* attribute)
  of a collection. The index ranges are specified in the *condition* attribute
  of the node.

- **InsertNode**:
  Inserts documents into a collection (given in its *collection* attribute).
  Appears exactly once in a query that contains an *INSERT* statement.

- **KShortestPathsNode**:
  Indicates a traversal for k Shortest Paths (`K_SHORTEST_PATHS` in AQL).

- **KPathsNode**:
  Indicates a traversal for k Paths (`K_PATHS` in AQL).

- **LimitNode**:
  Limits the number of results passed to other processing steps. Appears
  once per `LIMIT` statement.

- **MaterializeNode**:
  The presence of this node means that the query is not fully covered by
  indexes and therefore needs to involve the storage engine.

- **RemoveNode**:
  Removes documents from a collection (given in its *collection* attribute).
  Appears exactly once in a query that contains a `REMOVE` statement.

- **ReplaceNode**:
  Replaces documents in a collection (given in its *collection* attribute).
  Appears exactly once in a query that contains a `REPLACE` statement.

- **ReturnNode**:
  Returns data to the caller. Appears in each read-only query at
  least once. Subqueries also contain `ReturnNode`s.

- **SingletonNode**:
  The purpose of a `SingletonNode` is to produce an empty document that is
  used as input for other processing steps. Each execution plan contains
  exactly one `SingletonNode` as its top node.

- **ShortestPathNode**:
  Indicates a traversal for a Shortest Path (`SHORTEST_PATH` in AQL).

- **SortNode**:
  Performs a sort of its input values.

- **SubqueryEndNode**:
  End of a spliced (inlined) subquery.

- **SubqueryNode**:
  Executes a subquery.

- **SubqueryStartNode**:
  Beginning of a spliced (inlined) subquery.

- **TraversalNode**:
  Indicates a regular graph traversal, as opposed to a shortest path(s)
  traversal.

- **UpdateNode**:
  Updates documents in a collection (given in its *collection* attribute).
  Appears exactly once in a query that contains an `UPDATE` statement.

- **UpsertNode**:
  Upserts documents in a collection (given in its *collection* attribute).
  Appears exactly once in a query that contains an `UPSERT` statement.

For queries in the cluster, the following nodes may appear in execution plans:

- **DistributeNode**:
  Used on a Coordinator to fan-out data to one or multiple shards,
  taking into account a collection's shard key.

- **GatherNode**:
  Used on a Coordinator to aggregate results from one or many shards
  into a combined stream of results. Parallelizes work for certain types
  of queries when there are multiple DB-Servers involved
  (shown as `GATHER   /* parallel */` in query explain).

- **RemoteNode**:
  A `RemoteNode` performs communication with another ArangoDB instances
  in the cluster. For example, the cluster Coordinator needs to communicate
  with other servers to fetch the actual data from the shards. It does so
  via `RemoteNode`s. The data servers themselves might again pull further data
  from the Coordinator, and thus might also employ `RemoteNode`s. So, all of
  the above cluster relevant nodes are accompanied by a `RemoteNode`.

- **ScatterNode**:
  Used on a Coordinator to fan-out data to one or multiple shards.

- **SingleRemoteOperationNode**:
  Used on a Coordinator to directly work with a single
  document on a DB-Server that is referenced by its `_key`.

List of optimizer rules
-----------------------

The following optimizer rules may appear in the `rules` attribute of a plan:

- `fuse-filters`:
  Appears if the optimizer merges adjacent `FILTER` nodes together into a
  single `FILTER` node.

- `geo-index-optimizer`:
  Appears when a geo index is utilized.

- `handle-arangosearch-views`:
  Appears whenever an `arangosearch` or `search-alias` View is accessed in a query.

- `inline-subqueries`:
  Appears when a subquery is pulled out in its surrounding scope, e.g.
  `FOR x IN (FOR y IN collection FILTER y.value >= 5 RETURN y.test) RETURN x.a`
  becomes `FOR tmp IN collection FILTER tmp.value >= 5 LET x = tmp.test RETURN x.a`.

- `interchange-adjacent-enumerations`:
  Appears if a query contains multiple `FOR` statements whose order were
  permuted. Permutation of `FOR` statements is performed because it may enable
  further optimizations by other rules.

- `late-document-materialization`:
  Tries to read from collections as late as possible if the involved attributes
  are covered by regular indexes.

- `late-document-materialization-arangosearch`:
  Tries to read from the underlying collections of a View as late as possible
  if the involved attributes are covered by the View index.

- `move-calculations-down`:
  Appears if a `CalculationNode` is moved down in a plan. The intention of
  this rule is to move calculations down in the processing pipeline as far as
  possible (below `FILTER`, `LIMIT` and `SUBQUERY` nodes) so they are executed
  as late as possible and not before their results are required.

- `move-calculations-up`:
  Appears if a `CalculationNode` is moved up in a plan. The intention of
  this rule is to move calculations up in the processing pipeline as far as
  possible (ideally out of enumerations) so they are not executed in loops if
  not required. It is also quite common that this rule enables further
  optimizations to kick in.

- `move-filters-into-enumerate`:
  Moves filters on non-indexed collection attributes into `IndexNode` or
  `EnumerateCollectionNode` to allow early pruning of non-matching documents.
  This optimization can help to avoid a lot of temporary document copies.

- `move-filters-up`:
  Appears if a `FilterNode` is moved up in a plan. The intention of this
  rule is to move filters up in the processing pipeline as far as possible
  (ideally out of inner loops) so they filter results as early as possible.

- `optimize-count`:
  Appears if a subquery is modified to use the optimized code path for
  counting documents.
  The requirements are that the subquery result must only be used with the
  `COUNT`/`LENGTH` AQL function and not for anything else. The subquery itself 
  must be read-only (no data-modification subquery), not use nested FOR loops,
  no LIMIT clause and no FILTER condition or calculation that requires
  accessing document data. Accessing index data is supported for filtering (as
  in the above example that would use the edge index), but not for further 
  calculations.

- `optimize-subqueries`:
  Appears when optimizations are applied to a subquery. The optimizer rule
  adds a `LIMIT` statement to qualifying subqueries to make them return
  less data. Another optimization performed by this rule is to modify the
  result value of subqueries in case only the number of subquery results is
  checked later. This saves copying the document data from the subquery to the
  outer scope and may enable follow-up optimizations.

- `optimize-traversals`:
  Appears if the vertex, edge or path output variable in an AQL traversal
  is optimized away, or if a `FILTER` condition from the query is moved
  into the `TraversalNode` for early pruning of results.

- `patch-update-statements`:
  Appears if an `UpdateNode` or `ReplaceNode` is patched to not buffer its
  input completely, but to process it in smaller batches. The rule fires
  for an `UPDATE` or `REPLACE` query that is fed by a full collection scan or
  an index scan only, and that does not use any other collections, indexes,
  subqueries or traversals.

- `propagate-constant-attributes`:
  Appears when a constant value is inserted into a filter condition,
  replacing a dynamic attribute value.

- `reduce-extraction-to-projection`:
  Appears when an `EnumerationCollectionNode` or
  an `IndexNode` that would have extracted an entire document is modified to
  return only a projection of each document. Projections are limited to at most
  5 different document attributes by default. The maximum number of projected
  attributes can optionally be adjusted by setting the `maxProjections` hint
  for an AQL `FOR` operation since ArangoDB 3.9.1.

- `remove-collect-variables`:
  Appears if an `INTO` clause is removed from a `COLLECT` statement
  because the result of `INTO` is not used. May also appear if a result
  of a `COLLECT` statement's `AGGREGATE` variables is not used.

- `remove-data-modification-out-variables`:
  Avoids setting the pseudo-variables `OLD` and `NEW` if not used in
  data modification queries.

- `remove-filter-covered-by-index`:
  Appears if a `FilterNode` is removed or replaced because the filter
  condition is already covered by an `IndexNode`.

- `remove-filter-covered-by-traversal`:
  Appears if a `FilterNode` is removed or replaced because the filter
  condition is already covered by an `TraversalNode`.

- `remove-redundant-calculations`:
  Appears if redundant calculations (expressions
  with the exact same result) are found in the query. The optimizer rule
  then replaces references to the redundant expressions with a single reference,
  allowing other optimizer rules to remove the then-unneeded `CalculationNode`s.

- `remove-redundant-or`:
  Appears if multiple `OR` conditions for the same variable or attribute
  are combined into a single condition.

- `remove-redundant-path-var`:
  Avoids computing the variables emitted by traversals if they are unused
  in the query, significantly reducing overhead.

- `remove-redundant-sorts`:
  Appears if multiple `SORT` statements can be merged into fewer sorts.

- `remove-sort-rand-limit-1`:
  Appears when a `SORT RAND() LIMIT 1` construct is removed by moving the
  random iteration into an `EnumerateCollectionNode`.

- `remove-unnecessary-calculations`:
  Appears if `CalculationNode`s are removed from the query. The rule
  removes all calculations whose result is not referenced in the query (note
  that this may be a consequence of applying other optimizations).

- `remove-unnecessary-filters`:
  Appears if a `FilterNode` is removed or replaced. `FilterNode`s whose
  filter condition always evaluate to `true` are removed from the
  plan.

- `replace-function-with-index`:
  Appears when a deprecated index function such as `FULLTEXT()`, `NEAR()`,
  `WITHIN()` or `WITHIN_RECTANGLE()` is replaced with a regular subquery.

- `replace-or-with-in`:
  Appears if multiple `OR`-combined equality conditions on the same
  variable or attribute are replaced with an `IN` condition.

- `simplify-conditions`:
  Appears if the optimizer replaces parts in a CalculationNode's
  expression with simpler expressions.

- `sort-in-values`:
  Appears when the values used as right-hand side of an `IN` operator
  are pre-sorted using an extra function call. Pre-sorting the comparison array
  allows using a binary search in-list lookup with a logarithmic complexity
  instead of the default linear complexity in-list lookup.

- `sort-limit`:
  Appears when a `SortNode` is followed by a `LimitNode` with no
  intervening nodes that may change the element count (e.g. a `FilterNode`
  which cannot be moved before the sort, or a source node like
  `EnumerateCollectionNode`). This is used to make the `SortNode` aware of
  the limit and offset from the `LimitNode` to enable some optimizations
  internal to the `SortNode` which allow for reduced memory usage and and in
  many cases, improved sorting speed. The optimizer may choose not to apply
  the rule if it decides that it offers little or no benefit. In particular,
  it does not apply the rule if the input size is very small or if the output
  from the `LimitNode` is similar in size to the input. In exceptionally rare
  cases, this rule could result in some small slowdown. If observed, you can
  disable the rule for the affected query at the cost of increased memory usage.

- `splice-subqueries`:
  Appears when a subquery is spliced into the surrounding query.
  This is performed on all subqueries and cannot be switched off.
  This optimization is applied after all other optimizations, and reduces
  overhead for executing subqueries by inlining the execution. This mainly
  benefits queries which execute subqueries very often that only return a
  few results at a time.

- `use-index-for-sort`:
  Appears if an index can be used to avoid a `SORT` operation. If the rule
  is applied, a `SortNode` is removed from the plan.

- `use-indexes`:
  Appears when an index is used to iterate over a collection.
  As a consequence, an `EnumerateCollectionNode` is replaced with an
  `IndexNode` in the plan.

Some rules are applied a second time at a different optimization stage.
These rules show in plans with an appended `-2` to their name.

The following optimizer rules may appear in the `rules` attribute of
**cluster** plans:

- `cluster-one-shard` _(Enterprise Edition only)_:
  Appears for eligible queries in OneShard deployment mode as well as
  for queries that only involve collection(s) with a single shard (and identical
  sharding in case of multiple collections, e.g. via `distributeShardsLike`).
  Queries involving V8 / JavaScript (e.g. user-defined AQL functions) or
  SmartGraphs cannot be optimized.

  Offloads the entire query to the DB-Server (except the client communication
  via a Coordinator). This saves all the back and forth that normally exists
  in regular cluster queries, benefitting traversals and joins in particular.

- `collect-in-cluster`:
  Appears when a `CollectNode` on a Coordinator is accompanied by extra
  `CollectNode`s on the DB-Servers, which does the heavy processing and
  allows the `CollectNode` on the Coordinator to a light-weight aggregation only.

- `distribute-filtercalc-to-cluster`:
  Appear when filters are moved up in a
  distributed execution plan. Filters are moved as far up in the plan as
  possible to make result sets as small as possible as early as possible.

- `distribute-in-cluster`:
  Appears when query parts get distributed in a cluster.
  This is not an optimization rule, and it cannot be turned off.

- `distribute-sort-to-cluster`:
  Appears if sorts are moved up in a distributed query.
  Sorts are moved as far up in the plan as possible to make result sets as
  small as possible as early as possible.

- `optimize-cluster-single-document-operations`:
  It may appear if you directly reference a document by its `_key`. In this
  case, no AQL is executed on the DB-Servers. Instead, the Coordinator
  directly works with the documents on the DB-Servers.

- `parallelize-gather`:
  Appear if an optimization to execute Coordinator `GatherNodes` in
  parallel is applied. `GatherNode`s go into parallel mode only if the
  DB-Server query part above it (in terms of query execution plan layout) is a
  terminal part of the query. To trigger the optimization, there must not be
  other nodes of type `ScatterNode`, `GatherNode` or `DistributeNode` present
  in the query.

- `push-subqueries-to-dbserver` _(Enterprise Edition only)_:
  Appears if a subquery is determined to be executable entirely on a database
  server.
  A subquery can be executed on a DB-Server if it contains exactly one
  distribute/gather section, and only contains one collection access or
  traversal, shortest path, or k-shortest paths query.

- `remove-satellite-joins` _(Enterprise Edition only)_:
  Optimizes `ScatterNode`s, `GatherNode`s and `RemoteNode`s for SatelliteCollections
  and SatelliteGraphs away. Executes the respective query parts on each
  participating DB-Server independently, so that the results become available 
  locally without network communication.
  Depends on `remove-unnecessary-remote-scatter` rule.

- `remove-distribute-nodes` _(Enterprise Edition only)_:
  Combines `DistributeNode`s into one if possible. This rule triggers if 
  two adjacent `DistributeNode`s share the same input variables and therefore can be
  optimized into a single `DistributeNode`.

- `remove-unnecessary-remote-scatter`:
  Appears if a `RemoteNode` is followed by a `ScatterNode`, and the `ScatterNode`
  is only followed by calculations or the `SingletonNode`. In this case, there is
  no need to distribute the calculation, and it is handled centrally.

- `restrict-to-single-shard`:
  Appears if a collection operation (IndexNode or a data-modification node)
  only affects a single shard, and the operation can be restricted to the
  single shard and is not applied for all shards. This optimization can be
  applied for queries that access a collection only once in the query, and that
  do not use traversals, shortest path queries and that do not access collection
  data dynamically using the `DOCUMENT`, `FULLTEXT`, `NEAR` or `WITHIN` AQL
  functions. Additionally, the optimizer only pulls off this optimization
  if can safely determine the values of all the collection's shard keys from
  the query, and when the shard keys are covered by a single index (this is
  always true if the shard key is the default `_key`).

- `scatter-in-cluster`:
  Appears when `ScatterNode`s, `GatherNode`s, and `RemoteNode`s are inserted into a
  distributed query. This is not an optimization rule, and it cannot be
  turned off.

- `smart-joins` _(Enterprise Edition only)_:
  Appears when the query optimizer can reduce an inter-node join to a
  server-local join. This rule is only active in the *Enterprise Edition* of
  ArangoDB, and is only employed when joining two collections with
  identical sharding setup via their shard keys.

- `undistribute-remove-after-enum-coll`:
  Appears if a RemoveNode can be pushed into the same query part that
  enumerates over the documents of a collection. This saves inter-cluster
  roundtrips between the EnumerateCollectionNode and the RemoveNode.
  It includes simple `UPDATE` and `REPLACE` operations
  that modify multiple documents and do not use `LIMIT`.

- `scatter-satellite-graphs` _(Enterprise Edition only)_:
  Appears in case a `TraversalNode`, `ShortestPathNode`, or `KShortestPathsNode`
  is found that operates on a SatelliteGraph. This leads to the node being
  instantiated and executed on the DB-Server instead on a Coordinator.
  This removes the need to transfer data for this node and hence also
  increases performance.

Note that some rules may appear multiple times in the list, with number suffixes.
This is due to the same rule being applied multiple times, at different positions
in the optimizer pipeline.

### Additional optimizations applied

#### Scan-Only Optimization

If a query iterates over a collection (for filtering or counting) but does not need
the actual document values later, the optimizer can apply a "scan-only" optimization 
for `EnumerateCollectionNode` and  `IndexNode` node types. In this case, it does not build up
a result with the document data at all, which may reduce work significantly.
In case the document data is actually not needed later on, it may be sensible to remove 
it from query strings so the optimizer can apply the optimization.

If the optimization is applied, it shows up as `scan only` in an AQL
query's execution plan for an `EnumerateCollectionNode` or an `IndexNode`.

#### Index-Only Optimization

The optimizer can apply an "index-only" optimization for AQL queries that 
can satisfy the retrieval of all required document attributes directly from an index.

This optimization is triggered if an index is used
that covers all required attributes of the document used later on in the query.
If applied, it saves retrieving the actual document data (which would require
an extra lookup by the storage engine), but instead builds the document data solely 
from the index values found. It only applies when using up to 5 (or
[`maxProjections`](operations-for.html#maxprojections)) attributes
from the document, and only if the rest of the document data is not used later
on in the query.

The optimization is available for the following index types: `primary`,
`edge`, and `persistent`.

If the optimization is applied, it shows up as `index only` in an AQL
query's execution plan for an `IndexNode`.

#### Filter Projections Optimizations

<small>Introduced: v3.10.0</small>

If an index is used that does not cover all required attributes for the query,
but if it is followed by filter conditions that only access attributes that are
part of the index, then an optimization is applied, to only fetch matching
documents. "Part of the index" here means, that all attributes referred to in
the post-filter conditions are contained in the `fields` or `storedValues` 
attributes of the index definition.

For example, the optimization is applied in the following case:
- There is a persistent index on the attributes `[ "value1", "value2" ]` 
  (in this order), or there is a persistent index on just `["value1"]` and
  with a `storedValues` definition of `["value2"]`.
- There is a filter condition on `value1` that can use the index, and a filter
  condition on `value2` that cannot use the index (post-filter condition).

Example query:

```aql
FOR doc IN collection
  FILTER doc.value1 == @value1   /* uses the index */
  FILTER ABS(doc.value2) != @value2   /* does not use the index */
  RETURN doc
```

This query's execution plan looks as follows:

```aql
Execution plan:
 Id   NodeType        Est.   Comment
  1   SingletonNode      1   * ROOT
  8   IndexNode          0     - FOR doc IN collection   /* persistent index scan (filter projections: `value2`) */    FILTER (ABS(doc.`value2`) != 2)   /* early pruning */   
  7   ReturnNode         0       - RETURN doc

Indexes used:
 By   Name                      Type         Collection   Unique   Sparse   Cache   Selectivity   Fields                   Ranges
  8   idx_1737498319258648576   persistent   collection   false    false    false       99.96 %   [ `value1`, `value2` ]   (doc.`value1` == 1)
```

The first filter condition is transformed to an index lookup, as you can tell
from the `persistent index scan` comment and the `Indexes used` section that
shows the range `` doc.`value` == 1 ``. The post-filter condition
`FILTER ABS(doc.value2) != 2` can be recognized as such by the `early pruning`
comment that follows it.

The `filter projections` mentioned in the above execution plan is an indicator 
of the optimization being triggered.

Instead of fetching the full documents from the storage engine for all index
entries that matched the index lookup condition, only those that also satisfy
the index lookup post-filter condition are fetched.
If the post-filter condition filters out a lot of documents, this optimization
can significantly speed up queries that produce large result sets from index
lookups but filter many of the documents away with post-filter conditions.

Note that the optimization can also be combined with regular projections, e.g.
for the following query that returns a specific attribute from the documents
only:

```aql
FOR doc IN collection
  FILTER doc.value1 == @value1   /* uses the index */
  FILTER ABS(doc.value2) != @value2   /* does not use the index */
  RETURN doc.value3
```

That query's execution plan combines projections from the index for the
post-filter condition (`filter projections`) as well as regular projections
(`projections`) for the processing parts of the query that follow the
post-filter condition:

```aql
Execution plan:
 Id   NodeType          Est.   Comment
  1   SingletonNode        1   * ROOT
  9   IndexNode         5000     - FOR doc IN collection   /* persistent index scan (filter projections: `value2`) (projections: `value3`) */    FILTER (ABS(doc.`value2`) != 2)   /* early pruning */
  7   CalculationNode   5000       - LET #5 = doc.`value3`   /* attribute expression */   /* collections used: doc : collection */
  8   ReturnNode        5000       - RETURN #5

Indexes used:
 By   Name                      Type         Collection   Unique   Sparse   Cache   Selectivity   Fields                   Ranges
  9   idx_1737498319258648576   persistent   collection   false    false    false       99.96 %   [ `value1`, `value2` ]   (doc.`value1` == 1)
```

The optimization is most effective for queries in which many documents would
be selected by the index lookup condition, but many are filtered out by the 
post-filter condition.
