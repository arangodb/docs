---
fileID: examples-combining-graph-traversals
title: Combining Graph Traversals
weight: 3750
description: 
layout: default
---
## Finding the start vertex via a geo query

Our first example will locate the start vertex for a graph traversal via [a geo index](../../indexing/working-with-indexes/indexing-geo).
We use [the city graph](../../graphs/#the-city-graph) and its geo indexes:

![Cities Example Graph](/images/cities_graph.png)


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: COMBINING_GRAPH_01_create_graph
description: ''
render: input/output
version: '3.10'
release: stable
---
var examples = require("@arangodb/graph-examples/example-graph.js");
var g = examples.loadGraph("routeplanner");
~examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



We search all german cities in a range of 400 km around the ex-capital **Bonn**: **Hamburg** and **Cologne**.
We won't find **Paris** since its in the `frenchCity` collection.


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: COMBINING_GRAPH_02_show_geo
description: ''
render: input/output
version: '3.10'
release: stable
dataset: routeplanner
bindVars: 
  {
        "bonn": [7.0998, 50.7340],
        "radius": 400000
      }
---
FOR startCity IN germanCity
  FILTER GEO_DISTANCE(@bonn, startCity.geometry) < @radius
RETURN startCity._key
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Let's revalidate that the geo indexes are actually used:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: COMBINING_GRAPH_03_explain_geo
description: ''
render: input/output
version: '3.10'
release: stable
dataset: routeplanner
explain: 'true'
bindVars: 
  {
        "bonn": [7.0998, 50.7340],
        "radius": 400000
      }
---
FOR startCity IN germanCity
  FILTER GEO_DISTANCE(@bonn, startCity.geometry) < @radius
RETURN startCity._key
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



And now combine this with a graph traversal:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: COMBINING_GRAPH_04_combine
description: ''
render: input/output
version: '3.10'
release: stable
dataset: routeplanner
bindVars: 
  {
        "bonn": [7.0998, 50.7340],
        "radius": 400000
      }
---
FOR startCity IN germanCity
  FILTER GEO_DISTANCE(@bonn, startCity.geometry) < @radius
FOR v, e, p IN 1..1 OUTBOUND startCity
  GRAPH 'routeplanner'
RETURN {startcity: startCity._key, traversedCity: v._key}
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



The geo index query returns us `startCity` (**Cologne** and **Hamburg**) which we then use as starting point for our graph traversal.
For simplicity we only return their direct neighbours. We format the return result so we can see from which `startCity` the traversal came.

Alternatively we could use a `LET` statement with a subquery to group the traversals by their `startCity` efficiently:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: COMBINING_GRAPH_05_combine_let
description: ''
render: input/output
version: '3.10'
release: stable
dataset: routeplanner
bindVars: 
  {
        "bonn": [7.0998, 50.7340],
        "radius": 400000
      }
---
FOR startCity IN germanCity
  FILTER GEO_DISTANCE(@bonn, startCity.geometry) < @radius
LET oneCity = (
  FOR v, e, p IN 1..1 OUTBOUND startCity
GRAPH 'routeplanner' RETURN v._key
)
  RETURN {startCity: startCity._key, connectedCities: oneCity}
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Finally, we clean up again:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: COMBINING_GRAPH_06_cleanup
description: ''
render: input/output
version: '3.10'
release: stable
---
~var examples = require("@arangodb/graph-examples/example-graph.js");
~var g = examples.loadGraph("routeplanner");
examples.dropGraph("routeplanner");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


