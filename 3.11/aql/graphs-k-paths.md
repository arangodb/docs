---
layout: default
description: This type of query finds all paths between two given documents, a start and a target vertex in your graph
---
k Paths in AQL
==============

General query idea
------------------

This type of query finds all paths between two given documents,
*startVertex* and *targetVertex* in your graph. The paths are restricted
by minimum and maximum length of the paths.

Every such path will be returned as a JSON object with two components:

- an array containing the `vertices` on the path
- an array containing the `edges` on the path

**Example**

Let us take a look at a simple example to explain how it works.
This is the graph that we are going to find some paths on:

![Train Connection Map](../images/train_map.png)

Each ellipse stands for a train station with the name of the city written inside
of it. They are the vertices of the graph. Arrows represent train connections
between cities and are the edges of the graph. The numbers near the arrows
describe how long it takes to get from one station to another. They are used
as edge weights.

Let us assume that we want to go from **Aberdeen** to **London** by train.

Here we have a couple of alternatives:

a) Straight way

   1. Aberdeen
   2. Leuchars
   3. Edinburgh
   4. York
   5. London

b) Detour at York

   1. Aberdeen
   2. Leuchars
   3. Edinburgh
   4. York
   5. **Carlisle**
   6. **Birmingham**
   7. London

c) Detour at Edinburgh

   1. Aberdeen
   2. Leuchars
   3. Edinburgh
   4. **Glasgow**
   5. **Carlisle**
   6. **Birmingham**
   7. London

d) Detour at Edinburgh to York

   1. Aberdeen
   2. Leuchars
   3. Edinburgh
   4. **Glasgow**
   5. **Carlisle**
   6. York
   7. London

Note that we only consider paths as valid that do not contain the same vertex
twice. The following alternative would visit Aberdeen twice and will not be returned by k Paths:

1. Aberdeen
2. **Inverness**
3. **Aberdeen**
4. Leuchars
5. Edinburgh
6. York
7. London

Example Use Cases
-----------------

The use-cases for k Paths are about the same as for unweighted k Shortest Paths.
The main difference is that k Shortest Paths will enumerate all paths with
**increasing length**. It will stop as soon as a given limit is reached.
k Paths will instead only enumerate **all paths** within a given range of
path length, and are thereby upper-bounded.

The k Paths traversal can be used as foundation for several other algorithms:

* **Transportation** of any kind (e.g. road traffic, network package routing)
* **Flow problems**: We need to transfer items from A to B, which alternatives
  do we have? What is their capacity?

Syntax
------

The syntax for k Paths queries is similar to the one for
[K Shortest Path](graphs-kshortest-paths.html) with the addition to define the
minimum and maximum length of the path.

{% hint 'warning' %}
It is highly recommended that you use a reasonable maximum path length or a
**LIMIT** statement, as k Paths is a potentially expensive operation. On large
connected graphs it can return a large number of paths.
{% endhint %}

### Working with named graphs

```aql
FOR path
  IN MIN..MAX OUTBOUND|INBOUND|ANY K_PATHS
  startVertex TO targetVertex
  GRAPH graphName
  [OPTIONS options]
```

- `FOR`: emits the variable **path** which contains one path as an object
  containing `vertices` and `edges` of the path.
- `IN` `MIN..MAX`: the minimal and maximal depth for the traversal:
  - **min** (number, *optional*): paths returned by this query will
    have at least a length of *min* many edges.
    If not specified, it defaults to 1. The minimal possible value is 0.
  - **max** (number, *optional*): paths returned by this query will
    have at most a length of *max* many edges.
    If omitted, *max* defaults to *min*. Thus only the vertices and edges in
    the range of *min* are returned. *max* cannot be specified without *min*.
- `OUTBOUND|INBOUND|ANY`: defines in which direction
  edges are followed (outgoing, incoming, or both)
- `K_PATHS`: the keyword to compute all Paths
- **startVertex** `TO` **targetVertex** (both string\|object): the two vertices
  between which the paths will be computed. This can be specified in the form of
  a document identifier string or in the form of an object with the attribute
  `_id`. All other values will lead to a warning and an empty result. This is
  also the case if one of the specified documents does not exist.
- `GRAPH` **graphName** (string): the name identifying the named graph.
  Its vertex and edge collections will be looked up.
- `OPTIONS` **options** (object, *optional*): used to modify the execution of
  the search. Right now there are no options that trigger an effect.
  However, this may change in the future.

### Working with collection sets

```aql
FOR path
  IN MIN..MAX OUTBOUND|INBOUND|ANY K_PATHS
  startVertex TO targetVertex
  edgeCollection1, ..., edgeCollectionN
  [OPTIONS options]
```

Instead of `GRAPH graphName` you can specify a list of edge collections.
The involved vertex collections are determined by the edges of the given
edge collections.

### Traversing in mixed directions

For k paths with a list of edge collections you can optionally specify the
direction for some of the edge collections. Say for example you have three edge
collections *edges1*, *edges2* and *edges3*, where in *edges2* the direction
has no relevance, but in *edges1* and *edges3* the direction should be taken
into account. In this case you can use `OUTBOUND` as general search direction
and `ANY` specifically for *edges2* as follows:

```aql
FOR vertex IN OUTBOUND K_PATHS
  startVertex TO targetVertex
  edges1, ANY edges2, edges3
```

All collections in the list that do not specify their own direction will use the
direction defined after `IN` (here: `OUTBOUND`). This allows to use a different
direction for each collection in your path search.

Examples
--------

We load an example graph to get a named graph that reflects some possible
train connections in Europe and North America.

![Train Connection Map](../images/train_map.png)

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline GRAPHKP_01_create_graph
    @EXAMPLE_ARANGOSH_OUTPUT{GRAPHKP_01_create_graph}
    ~addIgnoreCollection("places");
    ~addIgnoreCollection("connections");
    var examples = require("@arangodb/graph-examples/example-graph");
    var graph = examples.loadGraph("kShortestPathsGraph");
    db.places.toArray();
    db.connections.toArray();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock GRAPHKP_01_create_graph
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Suppose we want to query all routes from **Aberdeen** to **London**.

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline GRAPHKP_01_Aberdeen_to_London
    @EXAMPLE_AQL{GRAPHKP_01_Aberdeen_to_London}
    @DATASET{kShortestPathsGraph}
    FOR p IN 1..10 OUTBOUND K_PATHS 'places/Aberdeen' TO 'places/London'
    GRAPH 'kShortestPathsGraph'
        RETURN { places: p.vertices[*].label, travelTimes: p.edges[*].travelTime }
    @END_EXAMPLE_AQL
    @endDocuBlock GRAPHKP_01_Aberdeen_to_London
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

If we ask for routes that don't exist we get an empty result
(from **Aberdeen** to **Toronto**):

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline GRAPHKP_02_Aberdeen_to_Toronto
    @EXAMPLE_AQL{GRAPHKP_02_Aberdeen_to_Toronto}
    @DATASET{kShortestPathsGraph}
    FOR p IN 1..10 OUTBOUND K_PATHS 'places/Aberdeen' TO 'places/Toronto'
    GRAPH 'kShortestPathsGraph'
        RETURN { places: p.vertices[*].label, travelTimes: p.edges[*].travelTime }
    @END_EXAMPLE_AQL
    @endDocuBlock GRAPHKP_02_Aberdeen_to_Toronto
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

And finally clean up by removing the named graph:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline GRAPHKP_99_drop_graph
    @EXAMPLE_ARANGOSH_OUTPUT{GRAPHKP_99_drop_graph}
    var examples = require("@arangodb/graph-examples/example-graph");
    examples.dropGraph("kShortestPathsGraph");
    ~removeIgnoreCollection("places");
    ~removeIgnoreCollection("connections");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock GRAPHKP_99_drop_graph
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
