---
layout: default
description: AQL queries are sent through an optimizer before execution
---
The AQL query optimizer
=======================

AQL queries are sent through an optimizer before execution. The task of the optimizer is
to create an initial execution plan for the query, look for optimization opportunities and
apply them. As a result, the optimizer might produce multiple execution plans for a
single query. It will then calculate the costs for all plans and pick the plan with the
lowest total cost. This resulting plan is considered to be the *optimal plan*, which is
then executed.

The optimizer is designed to only perform optimizations if they are *safe*, in the
meaning that an optimization should not modify the result of a query. A notable exception
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
    db.test.ensureIndex({ type: "skiplist", fields: [ "value" ] });
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

As you can see, the result details are very verbose so we will not show them in full in the next
sections. Instead, let's take a closer look at the results step by step.

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

When a plan is executed, the query execution engine will start with the node at
the bottom of the list (i.e. the *ReturnNode*).

The *ReturnNode*'s purpose is to return data to the caller. It does not produce
data itself, so it will ask the node above itself, this is the *CalculationNode*
in our example.
*CalculationNode*s are responsible for evaluating arbitrary expressions. In our
example query, the *CalculationNode* will evaluate the value of `i.value`, which
is needed by the *ReturnNode*. The calculation will be applied for all data the
*CalculationNode* gets from the node above it, in our example the *IndexNode*.

Finally, all of this needs to be done for documents of collection `test`. This is
where the *IndexNode* enters the game. It will use an index (thus its name)
to find certain documents in the collection and ship it down the pipeline in the
order required by `SORT i.value`. The *IndexNode* itself has a *SingletonNode*
as its input. The sole purpose of a *SingletonNode* node is to provide a single empty
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
It can do it safely because there is a sorted skiplist index on `i.value`, which it has
picked in the *IndexNode*. As the index values are iterated over in sorted order
anyway, the extra *SortNode* would have been redundant and was removed.

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
- `move-calculations-up`: moves a *CalculationNode* as far up in the processing pipeline
  as possible
- `move-filters-up`: moves a *FilterNode* as far up in the processing pipeline as
  possible
- `remove-redundant-calculations`: replaces references to variables with references to
  other variables that contain the exact same result. In the example query, `i.value`
  is calculated multiple times, but each calculation inside a loop iteration would
  produce the same value. Therefore, the expression result is shared by several nodes.
- `remove-unnecessary-calculations`: removes *CalculationNode*s whose result values are
  not used in the query. In the example this happens due to the `remove-redundant-calculations`
  rule having made some calculations unnecessary.
- `use-indexes`: use an index to iterate over a collection instead of performing a
  full collection scan. In the example case this makes sense, as the index can be
  used for filtering and sorting.
- `remove-filter-covered-by-index`: remove an unnecessary filter whose functionality
  is already covered by an index. In this case the index only returns documents 
  matching the filter.
- `use-index-for-sort`: removes a `SORT` operation if it is already satisfied by
  traversing over a sorted index

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

The optimizer will also return a list of variables used in a plan (and query). This
list will contain auxiliary variables created by the optimizer itself. This list
can be ignored by end users in most cases.

#### Cost of a query

For each plan the optimizer generates, it will calculate the total cost. The plan
with the lowest total cost is considered to be the optimal plan. Costs are
estimates only, as the actual execution costs are unknown to the optimizer.
Costs are calculated based on heuristics that are hard-coded into execution nodes.
Cost values do not have any unit.

### Retrieving all execution plans

To retrieve not just the optimal plan but a list of all plans the optimizer has
generated, set the option `allPlans` to `true`:

This will return a list of all plans in the `plans` attribute instead of in the
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

This will return an unoptimized plan in the `plan`:

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

The optimizer will return statistics as a part of an `explain` result.

The following attributes will be returned in the `stats` attribute of an `explain` result:

- `plansCreated`: total number of plans created by the optimizer
- `rulesExecuted`: number of rules executed (note: an executed rule does not
  indicate a plan was actually modified by a rule)
- `rulesSkipped`: number of rules skipped by the optimizer

Warnings
--------

For some queries, the optimizer may produce warnings. These will be returned in
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
bound is reached, no further warnings will be returned.

Optimization in a cluster
-------------------------

When you are running AQL in the cluster, the parsing of the query is done on the
Coordinator. The Coordinator then chops the query into snippets, which are either
to remain on the Coordinator or need to be distributed to the shards on the
DB-Servers over the network. The cutting sites are interconnected via *Scatter-*,
*Gather-* and *RemoteNodes*. These nodes mark the network borders of the snippets.

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

Using a cluster, there is a *Site* column if you explain a query.
Snippets marked with **DBS** are executed on DB-Servers, **COOR** ones are
executed on the respective Coordinator.

```
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

The following execution node types will appear in the output of `explain`:

- **CalculationNode**:
  evaluates an expression. The expression result may be used by
  other nodes, e.g. *FilterNode*, *EnumerateListNode*, *SortNode* etc.

- **CollectNode**:
  aggregates its input and produces new output variables. This will appear
  once per *COLLECT* statement.

- **EnumerateCollectionNode**:
  enumeration over documents of a collection (given in its *collection*
  attribute) without using an index.

- **EnumerateListNode**:
  enumeration over a list of (non-collection) values.

- **EnumerateViewNode**:
  enumeration over documents of a View.

- **FilterNode**:
  only lets values pass that satisfy a filter condition. Will appear once
  per *FILTER* statement.

- **IndexNode**:
  enumeration over one or many indexes (given in its *indexes* attribute)
  of a collection. The index ranges are specified in the *condition* attribute
  of the node.

- **InsertNode**:
  inserts documents into a collection (given in its *collection* attribute).
  Will appear exactly once in a query that contains an *INSERT* statement.

- **KShortestPathsNode**:
  indicates a traversal for k Shortest Paths (`K_SHORTEST_PATHS` in AQL).

- **LimitNode**:
  limits the number of results passed to other processing steps. Will appear
  once per *LIMIT* statement.

- **MaterializeNode**:
  the presence of this node means that the query is not fully covered by
  indexes and therefore needs to involve the storage engine.

- **RemoveNode**:
  removes documents from a collection (given in its *collection* attribute).
  Will appear exactly once in a query that contains a *REMOVE* statement.

- **ReplaceNode**:
  replaces documents in a collection (given in its *collection* attribute).
  Will appear exactly once in a query that contains a *REPLACE* statement.

- **ReturnNode**:
  returns data to the caller. Will appear in each read-only query at
  least once. Subqueries will also contain *ReturnNode*s.

- **SingletonNode**:
  the purpose of a *SingletonNode* is to produce an empty document that is
  used as input for other processing steps. Each execution plan will contain
  exactly one *SingletonNode* as its top node.

- **ShortestPathNode**:
  indicates a traversal for a Shortest Path (`SHORTEST_PATH` in AQL).

- **SortNode**:
  performs a sort of its input values.

- **SubqueryEndNode**:
  end of a spliced (inlined) subquery.

- **SubqueryNode**:
  executes a subquery.

- **SubqueryStartNode**:
  beginning of a spliced (inlined) subquery.

- **TraversalNode**:
  indicates a regular graph traversal, as opposed to a shortest path(s)
  traversal.

- **UpdateNode**:
  updates documents in a collection (given in its *collection* attribute).
  Will appear exactly once in a query that contains an *UPDATE* statement.

- **UpsertNode**:
  upserts documents in a collection (given in its *collection* attribute).
  Will appear exactly once in a query that contains an *UPSERT* statement.

For queries in the cluster, the following nodes may appear in execution plans:

- **DistributeNode**:
  used on a Coordinator to fan-out data to one or multiple shards,
  taking into account a collection's shard key.

- **GatherNode**:
  used on a Coordinator to aggregate results from one or many shards
  into a combined stream of results. Parallelizes work for certain types
  of queries when there are multiple DB-Servers involved
  (shown as `GATHER   /* parallel */` in query explain).

- **RemoteNode**:
  a *RemoteNode* will perform communication with another ArangoDB instances
  in the cluster. For example, the cluster Coordinator will need to communicate
  with other servers to fetch the actual data from the shards. It will do so
  via *RemoteNode*s. The data servers themselves might again pull further data
  from the Coordinator, and thus might also employ *RemoteNode*s. So, all of
  the above cluster relevant nodes will be accompanied by a *RemoteNode*.

- **ScatterNode**:
  used on a Coordinator to fan-out data to one or multiple shards.

- **SingleRemoteOperationNode**:
  used on a Coordinator to directly work with a single
  document on a DB-Server that was referenced by its `_key`.

List of optimizer rules
-----------------------

The following optimizer rules may appear in the `rules` attribute of a plan:

- `fuse-filters`:
  will appear if the optimizer merges adjacent FILTER nodes together into a
  single FILTER node

- `geo-index-optimizer`:
  will appear when a geo index is utilized.

- `handle-arangosearch-views`:
  appears whenever an ArangoSearch View is accessed in a query.

- `inline-subqueries`:
  will appear when a subquery was pulled out in its surrounding scope, e.g.
  `FOR x IN (FOR y IN collection FILTER y.value >= 5 RETURN y.test) RETURN x.a`
  would become `FOR tmp IN collection FILTER tmp.value >= 5 LET x = tmp.test RETURN x.a`

- `interchange-adjacent-enumerations`:
  will appear if a query contains multiple *FOR* statements whose order were
  permuted. Permutation of *FOR* statements is performed because it may enable
  further optimizations by other rules.

- `late-document-materialization`:
  tries to read from collections as late as possible if the involved attributes
  are covered by regular indexes.

- `late-document-materialization-arangosearch`:
  tries to read from the underlying collections of a View as late as possible
  if the involved attributes are covered by the View index.

- `move-calculations-down`:
  will appear if a *CalculationNode* was moved down in a plan. The intention of
  this rule is to move calculations down in the processing pipeline as far as
  possible (below *FILTER*, *LIMIT* and *SUBQUERY* nodes) so they are executed
  as late as possible and not before their results are required.

- `move-calculations-up`:
  will appear if a *CalculationNode* was moved up in a plan. The intention of
  this rule is to move calculations up in the processing pipeline as far as
  possible (ideally out of enumerations) so they are not executed in loops if
  not required. It is also quite common that this rule enables further
  optimizations to kick in.

- `move-filters-into-enumerate`:
  moves filters on non-indexed collection attributes into *IndexNode* or
  *EnumerateCollectionNode* to allow early pruning of non-matching documents.
  This optimization can help to avoid a lot of temporary document copies.

- `move-filters-up`:
  will appear if a *FilterNode* was moved up in a plan. The intention of this
  rule is to move filters up in the processing pipeline as far as possible
  (ideally out of inner loops) so they filter results as early as possible.

- `optimize-count`:
  will appear if a subquery was modified to use the optimized code path for
  counting documents.
  The requirements are that the subquery result must only be used with the
  `COUNT`/`LENGTH` AQL function and not for anything else. The subquery itself 
  must be read-only (no data-modification subquery), not use nested FOR loops,
  no LIMIT clause and no FILTER condition or calculation that requires
  accessing document data. Accessing index data is supported for filtering (as
  in the above example that would use the edge index), but not for further 
  calculations.

- `optimize-subqueries`:
  will appear when optimizations are applied to a subquery. The optimizer rule
  will add a *LIMIT* statement to qualifying subqueries to make them return
  less data. Another optimization performed by this rule is to modify the
  result value of subqueries in case only the number of subquery results is
  checked later. This saves copying the document data from the subquery to the
  outer scope and may enable follow-up optimizations.

- `optimize-traversals`:
  will appear if the vertex, edge or path output variable in an AQL traversal
  was optimized away, or if a *FILTER* condition from the query was moved
  in the *TraversalNode* for early pruning of results.

- `patch-update-statements`:
  will appear if an *UpdateNode* or *ReplaceNode* was patched to not buffer its
  input completely, but to process it in smaller batches. The rule will fire
  for an *UPDATE* or *REPLACE* query that is fed by a full collection scan or
  an index scan only, and that does not use any other collections, indexes,
  subqueries or traversals.

- `propagate-constant-attributes`:
  will appear when a constant value was inserted into a filter condition,
  replacing a dynamic attribute value.

- `reduce-extraction-to-projection`:
  will appear when an *EnumerationCollectionNode* or
  an *IndexNode* that would have extracted an entire document was modified to
  return only a projection of each document. Projections are limited to at most
  5 different document attributes. This optimizer rule is specific for the
  RocksDB storage engine.

- `remove-collect-variables`:
  will appear if an *INTO* clause was removed from a *COLLECT* statement
  because the result of *INTO* is not used. May also appear if a result
  of a *COLLECT* statement's *AGGREGATE* variables is not used.

- `remove-data-modification-out-variables`:
  avoids setting the pseudo-variables `OLD` and `NEW` if not used in
  data modification queries.

- `remove-filter-covered-by-index`:
  will appear if a *FilterNode* was removed or replaced because the filter
  condition is already covered by an *IndexNode*.

- `remove-filter-covered-by-traversal`:
  will appear if a *FilterNode* was removed or replaced because the filter
  condition is already covered by an *TraversalNode*.

- `remove-redundant-calculations`:
  will appear if redundant calculations (expressions
  with the exact same result) were found in the query. The optimizer rule will
  then replace references to the redundant expressions with a single reference,
  allowing other optimizer rules to remove the then-unneeded *CalculationNode*s.

- `remove-redundant-or`:
  will appear if multiple *OR* conditions for the same variable or attribute
  were combined into a single condition.

- `remove-redundant-path-var`:
  avoids computing the variables emitted by traversals if they are unused
  in the query, significantly reducing overhead.

- `remove-redundant-sorts`:
  will appear if multiple *SORT* statements can be merged into fewer sorts.

- `remove-sort-rand`:
  will appear when a *SORT RAND()* expression is removed by moving the random
  iteration into an *EnumerateCollectionNode*. This optimizer rule is specific
  for the MMFiles storage engine.

- `remove-unnecessary-calculations`:
  will appear if *CalculationNode*s were removed from the query. The rule will
  removed all calculations whose result is not referenced in the query (note
  that this may be a consequence of applying other optimizations).

- `remove-unnecessary-filters`:
  will appear if a *FilterNode* was removed or replaced. *FilterNode*s whose
  filter condition will always evaluate to *true* will be removed from the
  plan.

- `replace-function-with-index`:
  will appear when a deprecated index function such as `FULLTEXT()`, `NEAR()`,
  `WITHIN()` or `WITHIN_RECTANGLE()` is replaced with a regular subquery.

- `replace-or-with-in`:
  will appear if multiple *OR*-combined equality conditions on the same
  variable or attribute were replaced with an *IN* condition.

- `simplify-conditions`:
  will appear if the optimizer replaces parts in a CalculationNode's
  expression with simpler expressions 

- `sort-in-values`:
  will appear when the values used as right-hand side of an `IN` operator will
  be pre-sorted using an extra function call. Pre-sorting the comparison array
  allows using a binary search in-list lookup with a logarithmic complexity
  instead of the default linear complexity in-list lookup.

- `sort-limit`:
  will appear when a *SortNode* is followed by a *LimitNode* with no
  intervening nodes that may change the element count (e.g. a *FilterNode*
  which could not be moved before the sort, or a source node like
  *EnumerateCollectionNode*). This is used to make the *SortNode* aware of
  the limit and offset from the *LimitNode* to enable some optimizations
  internal to the *SortNode* which allow for reduced memory usage and and in
  many cases, improved sorting speed. The optimizer may choose not to apply
  the rule if it decides that it will offer little or no benefit. In particular
  it will not apply the rule if the input size is very small or if the output
  from the `LimitNode` is similar in size to the input. In exceptionally rare
  cases, this rule could result in some small slowdown. If observed, one can
  disable the rule for the affected query at the cost of increased memory usage.

- `splice-subqueries`:
  will appear when a subquery has been spliced into the surrounding query.
  This will be performed on all subqueries unless explicitily switched off.
  This optimization is applied after all other optimizations, and reduces
  overhead for executing subqueries by inlining the execution. This mainly
  benefits queries which execute subqueries very often that only return a
  few results at a time.

- `use-index-for-sort`:
  will appear if an index can be used to avoid a *SORT* operation. If the rule
  was applied, a *SortNode* was removed from the plan.

- `use-indexes`:
  will appear when an index is used to iterate over a collection.
  As a consequence, an *EnumerateCollectionNode* was replaced with an
  *IndexNode* in the plan.

Some rules are applied a second time at a different optimization stage.
These rules show in plans with an appended `-2` to their name.

The following optimizer rules may appear in the `rules` attribute of
**cluster** plans:

- `cluster-one-shard` _(Enterprise Edition only)_:
  will appear for eligible queries in OneShard deployment mode as well as
  for queries that only involve collection(s) with a single shard (and identical
  sharding in case of multiple collections, e.g. via *distributeShardsLike*).
  Queries involving V8 / JavaScript (e.g. user-defined AQL functions) or
  SmartGraphs can not be optimized.

  Offloads the entire query to the DB-Server (except the client communication
  via a Coordinator). This saves all the back and forth that normally exists
  in regular cluster queries, benefitting traversals and joins in particular.

- `collect-in-cluster`:
  will appear when a *CollectNode* on a Coordinator is accompanied by extra
  *CollectNode*s on the DB-Servers, which will do the heavy processing and
  allow the *CollectNode* on the Coordinator to a light-weight aggregation only.

- `distribute-filtercalc-to-cluster`:
  will appear when filters are moved up in a
  distributed execution plan. Filters are moved as far up in the plan as
  possible to make result sets as small as possible as early as possible.

- `distribute-in-cluster`:
  will appear when query parts get distributed in a cluster.
  This is not an optimization rule, and it cannot be turned off.

- `distribute-sort-to-cluster`:
  will appear if sorts are moved up in a distributed query.
  Sorts are moved as far up in the plan as possible to make result sets as
  small as possible as early as possible.

- `optimize-cluster-single-document-operations`:
  it may appear if you directly reference a document by its `_key`; in this
  case no AQL will be executed on the DB-Servers, instead the Coordinator will
  directly work with the documents on the DB-Servers.

- `parallelize-gather`:
  will appear if an optimization to execute Coordinator *GatherNodes* in
  parallel was applied. *GatherNode*s will go into parallel mode only if the
  DB-Server query part above it (in terms of query execution plan layout) is a
  terminal part of the query. To trigger the optimization, there must not be
  other nodes of type *ScatterNode*, *GatherNode* or *DistributeNode* present
  in the query.

- `push-subqueries-to-dbserver` _(Enterprise Edition only)_:
  will appear if a subquery is determined to be executable entirely on a database
  server.
  Currently a subquery can be executed on a DB-Server if it contains exactly one
  distribute/gather section, and only contains one collection access or
  traversal, shortest path, or k-shortest paths query.

- `remove-satellite-joins` _(Enterprise Edition only)_:
  optimizes *Scatter-*, *Gather-* and *RemoteNode*s for SatelliteCollections
  and SatelliteGraphs away. Executes the respective query parts on each
  participating DB-Server independently, so that the results become available 
  locally without network communication.
  Depends on *remove-unnecessary-remote-scatter* rule.

- `remove-distribute-nodes` _(Enterprise Edition only)_:
  combines *DistributeNode*s into one if possible. This rule will trigger if 
  two adjacent *DistributeNode*s share the same input variables and therefore can be
  optimized into a single *DistributeNode*.

- `remove-unnecessary-remote-scatter`:
  will appear if a RemoteNode is followed by a ScatterNode, and the ScatterNode
  is only followed by calculations or the SingletonNode. In this case, there is
  no need to distribute the calculation, and it will be handled centrally.

- `restrict-to-single-shard`:
  will appear if a collection operation (IndexNode or a data-modification node)
  will only affect a single shard, and the operation can be restricted to the
  single shard and is not applied for all shards. This optimization can be
  applied for queries that access a collection only once in the query, and that
  do not use traversals, shortest path queries and that do not access collection
  data dynamically using the `DOCUMENT`, `FULLTEXT`, `NEAR` or `WITHIN` AQL
  functions. Additionally, the optimizer will only pull off this optimization
  if can safely determine the values of all the collection's shard keys from
  the query, and when the shard keys are covered by a single index (this is
  always true if the shard key is the default `_key`).

- `scatter-in-cluster`:
  will appear when scatter, gather, and remote nodes are inserted into a
  distributed query. This is not an optimization rule, and it cannot be
  turned off.

- `smart-joins` _(Enterprise Edition only)_:
  will appear when the query optimizer can reduce an inter-node join to a
  server-local join. This rule is only active in the *Enterprise Edition* of
  ArangoDB, and will only be employed when joining two collections with
  identical sharding setup via their shard keys.

- `undistribute-remove-after-enum-coll`:
  will appear if a RemoveNode can be pushed into the same query part that
  enumerates over the documents of a collection. This saves inter-cluster
  roundtrips between the EnumerateCollectionNode and the RemoveNode.
  From v3.6.0 on, it includes simple *UPDATE* and *REPLACE* operations
  that modify multiple documents and do not use *LIMIT*.

- `scatter-satellite-graphs` _(Enterprise Edition only)_:
  will appear in case a TraversalNode, ShortestPathNode or KShortestPathsNode
  is found that operates on a SatelliteGraph. This leads to the node being
  instantiated and executed on the DB-Server instead on a Coordinator.
  This removes the need to transfer data for this node and hence also
  increases performance.

Note that some rules may appear multiple times in the list, with number suffixes.
This is due to the same rule being applied multiple times, at different positions
in the optimizer pipeline.

### Additional optimizations applied

If a query iterates over a collection (for filtering or counting) but does not need
the actual document values later, the optimizer can apply a "scan-only" optimization 
for *EnumerateCollectionNode*s and *IndexNode*s. In this case, it will not build up
a result with the document data at all, which may reduce work significantly especially
with the RocksDB storage engine. In case the document data is actually not needed
later on, it may be sensible to remove it from query strings so the optimizer can
apply the optimization.

If the optimization is applied, it will show up as "scan only" in an AQL
query's execution plan for an *EnumerateCollectionNode* or an *IndexNode*.

Additionally, the optimizer can apply an "index-only" optimization for AQL queries that 
can satisfy the retrieval of all required document attributes directly from an index.

This optimization will be triggered for the RocksDB engine if an index is used
that covers all required attributes of the document used later on in the query.
If applied, it will save retrieving the actual document data (which would require
an extra lookup in RocksDB), but will instead build the document data solely 
from the index values found. It will only be applied when using up to 5 attributes
from the document, and only if the rest of the document data is not used later
on in the query.

The optimization is currently available for the RocksDB engine for the index types
primary, edge, hash, skiplist and persistent.

If the optimization is applied, it will show up as "index only" in an AQL
query's execution plan for an *IndexNode*.
