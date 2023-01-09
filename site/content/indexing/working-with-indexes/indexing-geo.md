---
fileID: indexing-geo
title: Geo-Spatial Indexes
weight: 485
description: 
layout: default
---
To create a geo-spatial index on all documents using `latitude` and `longitude`
as separate attribute paths, two paths need to be specified in the `fields`
array:

`collection.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] })`

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

**Examples**

Create a geo index for an array attribute:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: geoIndexCreateForArrayAttribute1
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("geo")
 db.geo.ensureIndex({ type: "geo", fields: [ "loc" ] });
~db._drop("geo")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Create a geo index for an array attribute:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: geoIndexCreateForArrayAttribute2
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("geo2")
db.geo2.ensureIndex({ type: "geo", fields: [ "location.latitude", "location.longitude" ] });
~db._drop("geo2")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Use geo index with AQL SORT statement:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: geoIndexSortOptimization
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("geoSort")
db.geoSort.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] });
  for (i = -90;  i <= 90;  i += 10) {
  for (j = -180; j <= 180; j += 10) {
  db.geoSort.save({ name : "Name/" + i + "/" + j, latitude : i, longitude : j });
  }
  }
var query = "FOR doc in geoSort SORT DISTANCE(doc.latitude, doc.longitude, 0, 0) LIMIT 5 RETURN doc"
db._explain(query, {}, {colors: false});
db._query(query);
~db._drop("geoSort")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



Use geo index with AQL FILTER statement:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: geoIndexFilterOptimization
description: ''
render: input/output
version: '3.10'
release: stable
---
~db._create("geoFilter")
db.geoFilter.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] });
  for (i = -90;  i <= 90;  i += 10) {
  for (j = -180; j <= 180; j += 10) {
  db.geoFilter.save({ name : "Name/" + i + "/" + j, latitude : i, longitude : j });
  }
  }
var query = "FOR doc in geoFilter FILTER DISTANCE(doc.latitude, doc.longitude, 0, 0) < 2000 RETURN doc"
db._explain(query, {}, {colors: false});
db._query(query);
~db._drop("geoFilter")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 


