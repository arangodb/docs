---
fileID: graphs-general-graphs-functions
title: Graph Functions
weight: 630
description: 
layout: default
---
This chapter describes [various functions on a graph](../).
A lot of these accept a vertex (or edge) example as parameter as defined in the next section.

Examples will explain the API on the [the city graph](../#the-city-graph):

![Social Example Graph](/images/cities_graph.png)

## Definition of examples

For many of the following functions *examples* can be passed in as a parameter.
*Examples* are used to filter the result set for objects that match the conditions.
These *examples* can have the following values:

- `null`, there is no matching executed all found results are valid.
- A *string*, only results are returned, which `_id` equal the value of the string
- An example *object*, defining a set of attributes.
  Only results having these attributes are matched.
- A *list* containing example *objects* and/or *strings*.
  All results matching at least one of the elements in the list are returned.

## Get vertices from edges

### Get the source vertex of an edge

`graph._fromVertex(edgeId)`

Returns the vertex defined with the attribute `_from` of the edge with `edgeId` as its `_id`.

- `edgeId` (required): `_id` attribute of the edge

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphGetFromVertex
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  var any = require("@arangodb").db.relation.any();
  graph._fromVertex("relation/" + any._key);
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



### Get the target vertex of an edge

`graph._toVertex(edgeId)`

Returns the vertex defined with the attribute `_to` of the edge with `edgeId` as its `_id`.

- `edgeId` (required): `_id` attribute of the edge

**Examples**


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphGetToVertex
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("social");
  var any = require("@arangodb").db.relation.any();
  graph._toVertex("relation/" + any._key);
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _neighbors

Get all neighbors of the vertices defined by the example.

`graph._neighbors(vertexExample, options)`

The function accepts an id, an example, a list of examples or even an empty
example as parameter for vertexExample.
The complexity of this method is **O(n\*m^x)** with *n* being the vertices defined by the
parameter vertexExamplex, *m* the average amount of neighbors and *x* the maximal depths.
Hence the default call would have a complexity of **O(n\*m)**;

- `vertexExample` (optional): See [Definition of examples](#definition-of-examples)
- `options` (optional): An object defining further options. Can have the following values:
  - `direction`: The direction of the edges. Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `edgeExamples`: Filter the edges, see [Definition of examples](#definition-of-examples)
  - `neighborExamples`: Filter the neighbor vertices, see [Definition of examples](#definition-of-examples)
  - `edgeCollectionRestriction` : One or a list of edge-collection names that should be
    considered to be on the path.
  - `vertexCollectionRestriction` : One or a list of vertex-collection names that should be
    considered on the intermediate vertex steps.
  - `minDepth`: Defines the minimal number of intermediate steps to neighbors (default is 1).
  - `maxDepth`: Defines the maximal number of intermediate steps to neighbors (default is 1).

**Examples**

A route planner example, all neighbors of capitals.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleNeighbors1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._neighbors({isCapital : true});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, all outbound neighbors of Hamburg.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleNeighbors2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._neighbors('germanCity/Hamburg', {direction : 'outbound', maxDepth : 2});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _commonNeighbors

Get all common neighbors of the vertices defined by the examples.

`graph._commonNeighbors(vertex1Example, vertex2Examples, optionsVertex1, optionsVertex2)`

This function returns the intersection of `graph_module._neighbors(vertex1Example, optionsVertex1)`
and `graph_module._neighbors(vertex2Example, optionsVertex2)`.
For parameter documentation see [_neighbors](#_neighbors).

The complexity of this method is **O(n\*m^x)** with *n* being the maximal amount of vertices
defined by the parameters vertexExamples, *m* the average amount of neighbors and *x* the
maximal depths.
Hence the default call would have a complexity of **O(n\*m)**;

**Examples**

A route planner example, all common neighbors of capitals.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCommonNeighbors1
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var graph = examples.loadGraph("routeplanner");
graph._commonNeighbors({isCapital : true}, {isCapital : true});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, all common outbound neighbors of Hamburg with any other location
which have a maximal depth of 2 :


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCommonNeighbors2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._commonNeighbors(
    'germanCity/Hamburg',
    {},
    {direction : 'outbound', maxDepth : 2},
{direction : 'outbound', maxDepth : 2});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _countCommonNeighbors

Get the amount of common neighbors of the vertices defined by the examples.

`graph._countCommonNeighbors(vertex1Example, vertex2Examples, optionsVertex1, optionsVertex2)`

Similar to [_commonNeighbors](#_commonneighbors) but returns count instead of the elements.

**Examples**

A route planner example, all common neighbors of capitals.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCommonNeighborsAmount1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  var example = { isCapital: true };
  var options = { includeData: true };
  graph._countCommonNeighbors(example, example, options, options);
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, all common outbound neighbors of Hamburg with any other location
which have a maximal depth of 2 :


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCommonNeighborsAmount2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  var options = { direction: 'outbound', maxDepth: 2, includeData: true };
  graph._countCommonNeighbors('germanCity/Hamburg', {}, options, options);
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _commonProperties

Get the vertices of the graph that share common properties.

`graph._commonProperties(vertex1Example, vertex2Examples, options)`

The function accepts an id, an example, a list of examples or even an empty
example as parameter for vertex1Example and vertex2Example.

The complexity of this method is **O(n)** with *n* being the maximal amount of vertices
defined by the parameters vertexExamples.

- `vertex1Examples` (optional): Filter the set of source vertices, see [Definition of examples](#definition-of-examples)

- `vertex2Examples` (optional): Filter the set of vertices compared to, see [Definition of examples](#definition-of-examples)
- options (optional) An object defining further options. Can have the following values:
  - `vertex1CollectionRestriction` : One or a list of vertex-collection names that should be
    searched for source vertices.
  - `vertex2CollectionRestriction` : One or a list of vertex-collection names that should be
    searched for compare vertices.
  - `ignoreProperties` : One or a list of attribute names of a document that should be ignored.

**Examples**

A route planner example, all locations with the same properties:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleProperties1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._commonProperties({}, {});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, all cities which share same properties except for population.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleProperties2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._commonProperties({}, {}, {ignoreProperties: 'population'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _countCommonProperties

Get the amount of vertices of the graph that share common properties.

`graph._countCommonProperties(vertex1Example, vertex2Examples, options)`

Similar to [_commonProperties](#_commonproperties) but returns count instead of
the objects.

**Examples**

A route planner example, all locations with the same properties:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAmountProperties1
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var graph = examples.loadGraph("routeplanner");
graph._countCommonProperties({}, {});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, all German cities which share same properties except for population.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAmountProperties2
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var graph = examples.loadGraph("routeplanner");
  graph._countCommonProperties({}, {}, {vertex1CollectionRestriction : 'germanCity',
  vertex2CollectionRestriction : 'germanCity' ,ignoreProperties: 'population'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _paths

The _paths function returns all paths of a graph.

`graph._paths(options)`

This function determines all available paths in a graph.

The complexity of this method is **O(n\*n\*m)** with *n* being the amount of vertices in
the graph and *m* the average amount of connected edges;

- `options` (optional): An object containing options, see below:
  - `direction`: The direction of the edges. Possible values are `"any"`,
    `"inbound"`, and `"outbound"` (default).
  - `followCycles` (optional): If set to `true` the query follows cycles in the graph,
    default is false.
  - `minLength` (optional): Defines the minimal length a path must
    have to be returned (default is 0).
  - `maxLength` (optional): Defines the maximal length a path must
     have to be returned (default is 10).

**Examples**

Return all paths of the graph "social":


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModulePaths1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var g = examples.loadGraph("social");
  g._paths();
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Return all inbound paths of the graph "social" with a maximal
length of 1 and a minimal length of 2:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModulePaths2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var g = examples.loadGraph("social");
  g._paths({direction : 'inbound', minLength : 1, maxLength :  2});
~ examples.dropGraph("social");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _shortestPath

The _shortestPath function returns all shortest paths of a graph.

`graph._shortestPath(startVertexExample, endVertexExample, options)`

This function determines all shortest paths in a graph.
The function accepts an id, an example, a list of examples
or even an empty example as parameter for
start and end vertex.
The length of a path is by default the amount of edges from one start vertex to
an end vertex. The option weight allows the user to define an edge attribute
representing the length.

- `startVertexExample` (optional): An example for the desired start Vertices (see [Definition of examples](#definition-of-examples)).
- `endVertexExample` (optional): An example for the desired end Vertices (see [Definition of examples](#definition-of-examples)).
- `options` (optional): An object containing options, see below:
  - `direction`: The direction of the edges as a string.
    Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `edgeCollectionRestriction`: One or multiple edge
    collection names. Only edges from these collections will be considered for the path.
  - `startVertexCollectionRestriction`: One or multiple vertex
    collection names. Only vertices from these collections will be considered as
    start vertex of a path.
  - `endVertexCollectionRestriction`: One or multiple vertex
    collection names. Only vertices from these collections will be considered as
    end vertex of a path.
  - `weight`: The name of the attribute of
    the edges containing the length as a string.
  - `defaultWeight`: Only used with the option `weight`.
    If an edge does not have the attribute named as defined in option `weight` this default
    is used as length.
    If no default is supplied the default would be positive Infinity so the path could
    not be calculated.

**Examples**

A route planner example, shortest path from all german to all french cities:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleShortestPaths1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var g = examples.loadGraph("routeplanner");
  g._shortestPath({}, {}, {weight : 'distance', endVertexCollectionRestriction : 'frenchCity',
  startVertexCollectionRestriction : 'germanCity'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, shortest path from Hamburg and Cologne to Lyon:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleShortestPaths2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var g = examples.loadGraph("routeplanner");
  g._shortestPath([{_id: 'germanCity/Cologne'},{_id: 'germanCity/Munich'}], 'frenchCity/Lyon',
  {weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _distanceTo

The _distanceTo function returns all paths and there distance within a graph.

`graph._distanceTo(startVertexExample, endVertexExample, options)`

This function is a wrapper of [graph._shortestPath](#_shortestpath).
It does not return the actual path but only the distance between two vertices.

**Examples**

A route planner example, shortest distance from all german to all french cities:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleDistanceTo1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var g = examples.loadGraph("routeplanner");
  g._distanceTo({}, {}, {weight : 'distance', endVertexCollectionRestriction : 'frenchCity',
  startVertexCollectionRestriction : 'germanCity'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, shortest distance from Hamburg and Cologne to Lyon:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleDistanceTo2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var g = examples.loadGraph("routeplanner");
  g._distanceTo([{_id: 'germanCity/Cologne'},{_id: 'germanCity/Munich'}], 'frenchCity/Lyon',
  {weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _absoluteEccentricity

Get the
[eccentricity](http://en.wikipedia.org/wiki/Distance_%28graph_theory%29)
of the vertices defined by the examples.

`graph._absoluteEccentricity(vertexExample, options)`

The function accepts an id, an example, a list of examples or even an empty
example as parameter for vertexExample.

- `vertexExample` (optional): Filter the vertices, see [Definition of examples](#definition-of-examples)
- `options` (optional): An object defining further options. Can have the following values:
  - `direction`: The direction of the edges. Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `edgeCollectionRestriction` : One or a list of edge-collection names that should be
    considered to be on the path.
  - `startVertexCollectionRestriction` : One or a list of vertex-collection names that should be
    considered for source vertices.
  - `endVertexCollectionRestriction` : One or a list of vertex-collection names that should be
    considered for target vertices.
  - `weight`: The name of the attribute of the edges containing the weight.
  - `defaultWeight`: Only used with the option `weight`.
    If an edge does not have the attribute named as defined in option `weight` this default
    is used as weight.
    If no default is supplied the default would be positive infinity so the path and
    hence the eccentricity can not be calculated.

**Examples**

A route planner example, the absolute eccentricity of all locations.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsEccentricity1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteEccentricity({});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the absolute eccentricity of all locations.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsEccentricity2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteEccentricity({}, {weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the absolute eccentricity of all cities regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsEccentricity3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteEccentricity({}, {startVertexCollectionRestriction : 'germanCity',
  direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _eccentricity

Get the normalized
[eccentricity](http://en.wikipedia.org/wiki/Distance_%28graph_theory%29)
of the vertices defined by the examples.

`graph._eccentricity(vertexExample, options)`

Similar to [_absoluteEccentricity](#_absoluteeccentricity) but returns a normalized result.

**Examples**

A route planner example, the eccentricity of all locations.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleEccentricity2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._eccentricity();
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the weighted eccentricity.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleEccentricity3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._eccentricity({weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _absoluteCloseness

Get the
[closeness](http://en.wikipedia.org/wiki/Centrality#Closeness_centrality)
of the vertices defined by the examples.

`graph._absoluteCloseness(vertexExample, options)`

The function accepts an id, an example, a list of examples or even an empty
example as parameter for `vertexExample`.

- `vertexExample` (optional): Filter the vertices, see [Definition of examples](#definition-of-examples)
- options (optional) An object defining further options. Can have the following values:
  - `direction`: The direction of the edges. Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `edgeCollectionRestriction` : One or a list of edge-collection names that should be
    considered to be on the path.
  - `startVertexCollectionRestriction` : One or a list of vertex-collection names that should be
    considered for source vertices.
  - `endVertexCollectionRestriction` : One or a list of vertex-collection names that should be
    considered for target vertices.
  - `weight`: The name of the attribute of the edges containing the weight.
  - `defaultWeight`: Only used with the option `weight`.
    If an edge does not have the attribute named as defined in option `weight` this default
    is used as weight.
    If no default is supplied the default would be positive infinity so the path and
    hence the closeness can not be calculated.

**Examples**

A route planner example, the absolute closeness of all locations.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsCloseness1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteCloseness({});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the absolute closeness of all locations.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsCloseness2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteCloseness({}, {weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the absolute closeness of all German Cities regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsCloseness3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteCloseness({}, {startVertexCollectionRestriction : 'germanCity',
  direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _closeness

Get the normalized
[closeness](http://en.wikipedia.org/wiki/Centrality#Closeness_centrality)
of graphs vertices.

`graph._closeness(options)`

Similar to [_absoluteCloseness](#_absolutecloseness) but returns a normalized value.

**Examples**

A route planner example, the normalized closeness of all locations.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCloseness1
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var graph = examples.loadGraph("routeplanner");
graph._closeness();
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the closeness of all locations.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCloseness2
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var graph = examples.loadGraph("routeplanner");
graph._closeness({weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the closeness of all cities regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleCloseness3
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var graph = examples.loadGraph("routeplanner");
graph._closeness({direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _absoluteBetweenness

Get the
[betweenness](http://en.wikipedia.org/wiki/Betweenness_centrality)
of all vertices in the graph.

`graph._absoluteBetweenness(vertexExample, options)`

- `vertexExample` (optional): Filter the vertices, see [Definition of examples](#definition-of-examples)
- `options` (optional): An object defining further options. Can have the following values:
  - `direction`: The direction of the edges. Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `weight`: The name of the attribute of the edges containing the weight.
  - `defaultWeight`: Only used with the option `weight`.
    If an edge does not have the attribute named as defined in option `weight` this default
    is used as weight.
    If no default is supplied the default would be positive infinity so the path and
    hence the betweenness can not be calculated.

**Examples**

A route planner example, the absolute betweenness of all locations.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsBetweenness1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteBetweenness({});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the absolute betweenness of all locations.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsBetweenness2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteBetweenness({weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the absolute betweenness of all cities regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleAbsBetweenness3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._absoluteBetweenness({direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _betweenness

Get the normalized
[betweenness](http://en.wikipedia.org/wiki/Betweenness_centrality)
of graphs vertices.

`graph_module._betweenness(options)`

Similar to [_absoluteBetweenness](#_absolutebetweenness) but returns normalized values.

**Examples**

A route planner example, the betweenness of all locations.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleBetweenness1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._betweenness();
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the betweenness of all locations.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleBetweenness2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._betweenness({weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the betweenness of all cities regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleBetweenness3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._betweenness({direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _radius

Get the
[radius](http://en.wikipedia.org/wiki/Eccentricity_%28graph_theory%29)
of a graph.

- `options` (optional): An object defining further options. Can have the following values:
  - `direction`: The direction of the edges. Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `weight`: The name of the attribute of the edges containing the weight.
  - `defaultWeight`: Only used with the option `weight`.
    If an edge does not have the attribute named as defined in option `weight` this default
    is used as weight.
    If no default is supplied the default would be positive infinity so the path and
    hence the radius can not be calculated.

**Examples**

A route planner example, the radius of the graph.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleRadius1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._radius();
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the radius of the graph.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleRadius2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._radius({weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the radius of the graph regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleRadius3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._radius({direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



## _diameter

Get the
[diameter](http://en.wikipedia.org/wiki/Eccentricity_%28graph_theory%29)
of a graph.

`graph._diameter(graphName, options)`

- `options` (optional): An object defining further options. Can have the following values:
  - `direction`: The direction of the edges. Possible values are `"outbound"`, `"inbound"`, and `"any"` (default).
  - `weight`: The name of the attribute of the edges containing the weight.
  - `defaultWeight`: Only used with the option `weight`.
    If an edge does not have the attribute named as defined in option `weight` this default
    is used as weight.
    If no default is supplied the default would be positive infinity so the path and
    hence the radius can not be calculated.

**Examples**

A route planner example, the diameter of the graph.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleDiameter1
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._diameter();
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the diameter of the graph.
This considers the actual distances.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleDiameter2
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._diameter({weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



A route planner example, the diameter of the graph regarding only
outbound paths.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: generalGraphModuleDiameter3
description: ''
render: input/output
version: '3.10'
release: stable
---
  var examples = require("@arangodb/graph-examples/example-graph.js");
  var graph = examples.loadGraph("routeplanner");
  graph._diameter({direction : 'outbound', weight : 'distance'});
~ examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


