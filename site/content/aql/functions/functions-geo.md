---
fileID: functions-geo
title: Geo functions
weight: 3895
description: 
layout: default
---
`IS_IN_POLYGON(polygon, coord, useLonLat) → bool`

The 2nd parameter can alternatively be specified as an array with two values.

By default, each array element in *polygon* is expected to be in the format
*[lat, lon]*. This can be changed by setting the 3rd parameter to *true* to
interpret the points as *[lon, lat]*. *coord* will then also be interpreted in
the same way.

- **polygon** (array): an array of arrays with 2 elements each, representing the
  points of the polygon
- **coord** (array): the search coordinate as a number array with two elements
- **useLonLat** (bool, *optional*): if set to *true*, the coordinates in
  *polygon* and the search coordinate *coord* will be interpreted as
  *[lon, lat]* (GeoJSON). The default is *false* and the format *[lat, lon]* is
  expected.
- returns **bool** (bool): *true* if the point *coord* is inside the *polygon*
  or *false* if it's not. The result is undefined (can be *true* or *false*) if
  the specified point is exactly on a boundary of the polygon.

```aql
// will check if the point (lat 4, lon 7) is contained inside the polygon
IS_IN_POLYGON( [ [ 0, 0 ], [ 0, 10 ], [ 10, 10 ], [ 10, 0 ] ], [ 4, 7 ] )

// will check if the point (lat 4, lon 7) is contained inside the polygon
IS_IN_POLYGON( [ [ 0, 0 ], [ 10, 0 ], [ 10, 10 ], [ 0, 10 ] ], [ 7, 4 ], true )
```

## GeoJSON Constructors

The following helper functions are available to easily create valid GeoJSON
output. In all cases you can write equivalent JSON yourself, but these functions
will help you to make all your AQL queries shorter and easier to read.

### GEO_LINESTRING()

`GEO_LINESTRING(points) → geoJson`

Construct a GeoJSON LineString.
Needs at least two longitude/latitude pairs.

- **points** (array): number array of longitude/latitude pairs
- returns **geoJson** (object): a valid GeoJSON LineString


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoLineString_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_LINESTRING([
[35, 10], [45, 45]
])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





### GEO_MULTILINESTRING()

`GEO_MULTILINESTRING(points) → geoJson`

Construct a GeoJSON MultiLineString.
Needs at least two elements consisting valid LineStrings coordinate arrays.

- **points** (array): array of LineStrings
- returns **geoJson** (object): a valid GeoJSON MultiLineString


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoMultiLineString_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_MULTILINESTRING([
[[100.0, 0.0], [101.0, 1.0]],
[[102.0, 2.0], [101.0, 2.3]]
])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





### GEO_MULTIPOINT()

`GEO_MULTIPOINT(points) → geoJson`

Construct a GeoJSON LineString. Needs at least two longitude/latitude pairs.

- **points** (array): number array of longitude/latitude pairs
- returns **geoJson** (object): a valid GeoJSON Point


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoMultiPoint_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_MULTIPOINT([
[35, 10], [45, 45]
])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





### GEO_POINT()

`GEO_POINT(longitude, latitude) → geoJson`

Construct a valid GeoJSON Point.

- **longitude** (number): the longitude portion of the point
- **latitude** (number): the latitude portion of the point
- returns **geoJson** (object): a GeoJSON Point


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoPoint_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_POINT(1.0, 2.0)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





### GEO_POLYGON()

`GEO_POLYGON(points) → geoJson`

Construct a GeoJSON Polygon. Needs at least one array representing
a linear ring. Each linear ring consists of an array with at least four
longitude/latitude pairs. The first linear ring must be the outermost, while
any subsequent linear ring will be interpreted as holes.

For details about the rules, see [GeoJSON polygons](../../indexing/working-with-indexes/indexing-geo#polygon).

- **points** (array): array of (arrays of) longitude/latitude pairs
- returns **geoJson** (object\|null): a valid GeoJSON Polygon

A validation step is performed using the S2 geometry library. If the
validation is not successful, an AQL warning is issued and `null` is
returned.

Simple Polygon:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoPolygon_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_POLYGON([
[0.0, 0.0], [7.5, 2.5], [0.0, 5.0]
])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





Advanced Polygon with a hole inside:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoPolygon_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_POLYGON([
[[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]],
[[20, 30], [30, 20], [35, 35], [20, 30]]
])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





### GEO_MULTIPOLYGON()

`GEO_MULTIPOLYGON(polygons) → geoJson`

Construct a GeoJSON MultiPolygon. Needs at least two Polygons inside.
See [GEO_POLYGON()](#geo_polygon) and [GeoJSON MultiPolygons](../../indexing/working-with-indexes/indexing-geo#multipolygon) for the rules of Polygon and MultiPolygon construction.

- **polygons** (array): array of arrays of array of longitude/latitude pairs
- returns **geoJson** (object\|null): a valid GeoJSON MultiPolygon

A validation step is performed using the S2 geometry library, if the
validation is not successful, an AQL warning is issued and `null` is
returned.

MultiPolygon comprised of a simple Polygon and a Polygon with hole:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlGeoMultiPolygon_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN GEO_MULTIPOLYGON([
[
[[40, 40], [20, 45], [45, 30], [40, 40]]
],
[
[[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]],
[[30, 20], [20, 15], [20, 25], [30, 20]]
]
])
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}





## Geo Index Functions

{{% hints/warning %}}
The AQL functions `NEAR()`, `WITHIN()` and `WITHIN_RECTANGLE()` are
deprecated starting from version 3.4.0.
Please use the [Geo utility functions](#geo-utility-functions) instead.
{{% /hints/warning %}}

AQL offers the following functions to filter data based on
[geo indexes](../../indexing/working-with-indexes/indexing-geo). These functions require the collection
to have at least one geo index. If no geo index can be found, calling this
function will fail with an error at runtime. There is no error when explaining
the query however.

### NEAR()

{{% hints/warning %}}
`NEAR` is a deprecated AQL function from version 3.4.0 on.
Use [DISTANCE()](#distance) in a query like this instead:

```aql
FOR doc IN doc
  SORT DISTANCE(doc.latitude, doc.longitude, paramLatitude, paramLongitude) ASC
  RETURN doc
```
Assuming there exists a geo-type index on `latitude` and `longitude`, the
optimizer will recognize it and accelerate the query.
{{% /hints/warning %}}

`NEAR(coll, latitude, longitude, limit, distanceName) → docArray`

Return at most *limit* documents from collection *coll* that are near
*latitude* and *longitude*. The result contains at most *limit* documents,
returned sorted by distance, with closest distances being returned first.
Optionally, the distances in meters between the specified coordinate
(*latitude* and *longitude*) and the document coordinates can be returned as
well. To make use of that, the desired attribute  name for the distance result
has to be specified in the *distanceName* argument. The result documents will
contain the distance value in an attribute of that name.

- **coll** (collection): a collection
- **latitude** (number): the latitude portion of the search coordinate
- **longitude** (number): the longitude portion of the search coordinate
- **limit** (number, *optional*): cap the result to at most this number of
  documents. The default is 100. If more documents than *limit* are found,
  it is undefined which ones will be returned.
- **distanceName** (string, *optional*): include the distance to the search
  coordinate in each document in the result (in meters), using the attribute
  name *distanceName*
- returns **docArray** (array): an array of documents, sorted by distance
  (shortest distance first)

### WITHIN()

{{% hints/warning %}}
`WITHIN` is a deprecated AQL function from version 3.4.0 on.
Use [DISTANCE()](#distance) in a query like this instead:

```aql
FOR doc IN doc
  LET d = DISTANCE(doc.latitude, doc.longitude, paramLatitude, paramLongitude)
  FILTER d <= radius
  SORT d ASC
  RETURN doc
```

Assuming there exists a geo-type index on `latitude` and `longitude`, the
optimizer will recognize it and accelerate the query.
{{% /hints/warning %}}

`WITHIN(coll, latitude, longitude, radius, distanceName) → docArray`

Return all documents from collection *coll* that are within a radius of *radius*
around the specified coordinate (*latitude* and *longitude*). The documents
returned are sorted by distance to the search coordinate, with the closest
distances being returned first. Optionally, the distance in meters between the
search coordinate and the document coordinates can be returned as well. To make
use of that, an attribute name for the distance result has to be specified in
the *distanceName* argument. The result documents will contain the distance
value in an attribute of that name.

- **coll** (collection): a collection
- **latitude** (number): the latitude portion of the search coordinate
- **longitude** (number): the longitude portion of the search coordinate
- **radius** (number): radius in meters
- **distanceName** (string, *optional*): include the distance to the search
  coordinate in each document in the result (in meters), using the attribute
  name *distanceName*
- returns **docArray** (array): an array of documents, sorted by distance
  (shortest distance first)

### WITHIN_RECTANGLE()

{{% hints/warning %}}
`WITHIN_RECTANGLE` is a deprecated AQL function from version 3.4.0 on. Use
[GEO_CONTAINS](#geo_contains) and a GeoJSON polygon instead:

```aql
LET rect = {type: "Polygon", coordinates: [[[longitude1, latitude1], ...]]]}
FOR doc IN doc
  FILTER GEO_CONTAINS(poly, [doc.longitude, doc.latitude])
  RETURN doc
```
Assuming there exists a geo-type index on `latitude` and `longitude`, the
optimizer will recognize it and accelerate the query.
{{% /hints/warning %}}

`WITHIN_RECTANGLE(coll, latitude1, longitude1, latitude2, longitude2) → docArray`

Return all documents from collection *coll* that are positioned inside the
bounding rectangle with the points (*latitude1*, *longitude1*) and (*latitude2*,
*longitude2*). There is no guaranteed order in which the documents are returned.

- **coll** (collection): a collection
- **latitude1** (number): the bottom-left latitude portion of the search
  coordinate
- **longitude1** (number): the bottom-left longitude portion of the search
  coordinate
- **latitude2** (number): the top-right latitude portion of the search
  coordinate
- **longitude2** (number): the top-right longitude portion of the search
  coordinate
- returns **docArray** (array): an array of documents, in random order
