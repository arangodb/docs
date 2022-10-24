---
layout: default
description: ArangoDB features a Google S2-based geospatial index 
---
Geo-Spatial Indexes
===================

ArangoDB features a [Google S2](http://s2geometry.io/){:target="_blank"}-based geospatial index
since version 3.4.0, which supersedes the previous geo index implementation.
Indexing is supported for a subset of the [**GeoJSON**](#geojson) geometry types
as well as simple latitude/longitude pairs.

AQL's geospatial functions and GeoJSON constructors are described in
[Geo functions](aql/functions-geo.html).

You can also perform
[geospatial searches with ArangoSearch](arangosearch-geospatial-search.html).

Using a Geo-Spatial Index
-------------------------

The geospatial index supports distance, containment, and intersection
queries for various geometric 2D shapes. You should mainly be using AQL queries
to perform these types of operations. The index can operate in **two different
modes**, depending on if you want to use the GeoJSON data-format or not. The modes
are mainly toggled by using the `geoJson` field when creating the index.

This index assumes coordinates with the latitude between -90 and 90 degrees and the
longitude between -180 and 180 degrees. A geo index will ignore all 
documents which do not fulfill these requirements.

### GeoJSON Mode

To create an index in GeoJSON mode execute:

```js
collection.ensureIndex({ type: "geo", fields: [ "geometry" ], geoJson:true })
```

This creates the index on all documents and uses _geometry_ as the attributed
field where the value is either a
[Geometry Object](https://tools.ietf.org/html/rfc7946#section-3.1){:target="_blank"}
**or** a _coordinate array_. The array must contain at least two numeric values
with longitude (first value) and latitude (second value). This corresponds
to the format described in
[RFC 7946 Position](https://tools.ietf.org/html/rfc7946#section-3.1.1){:target="_blank"}.

All documents, that do not have the attribute path or have a non-conforming
value in it, are excluded from the index.

A geo index is implicitly sparse, and there is no way to control its
sparsity.
In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

See [GeoJSON Interpretation](#geojson-interpretation) for technical details on
how ArangoDB interprets GeoJSON objects. In short: the **syntax** of GeoJSON is
used, but polygon boundaries and lines between points are interpreted as
geodesics (pieces of great circles on Earth).

### Non-GeoJSON mode

This index mode exclusively supports indexing on coordinate arrays. Values that
contain GeoJSON or other types of data will be ignored. In the non-GeoJSON mode
the index can be created on one or two fields.

The following examples will work in the _arangosh_ command shell.

To create a geo-spatial index on all documents using `latitude` and
`longitude` as separate attribute paths, two paths need to be specified
in the `fields` array:

`collection.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] })`

The first field is always defined to be the _latitude_ and the second is the
_longitude_. The `geoJson` flag is implicitly _false_ in this mode.

Alternatively you can specify only one field:

`collection.ensureIndex({ type: "geo", fields: [ "location" ], geoJson:false })`

It creates a geospatial index on all documents using `location` as the path to the
coordinates. The value of the attribute has to be an array with at least two
numeric values. The array must contain the latitude (first value) and the
longitude (second value).

All documents, which do not have the attribute path(s) or have a non-conforming
value in it, are excluded from the index.

A geo index is implicitly sparse, and there is no way to control its
sparsity.
In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

### Legacy Polygons

See [GeoJSON Interpretation](#geojson-interpretation) for details of the changes
between ArangoDB 3.10 and earlier versions. Two things have changed:

- boundaries of polygons are now geodesics and there is no special
  and inconsistent treatment of "rectangles" any more
- linear rings are interpreted according to the rules and no longer
  "normalized"

For backward compatibility, a new `legacyPolygons` option has been introduced
for geo indexes. It is relevant for those that have `geoJson` set to
`true` only. Old geo indexes from versions from below 3.10 will always
implicitly have the `legacyPolygons` option set to `true`. Newly generated
geo indexes from 3.10 on will have the `legacyPolygons` option by default
set to `false`, however, it can still be explicitly overwritten with
`true` to create a legacy index but is not recommended.

A geo index with `legacyPolygons` set to `true` will use the old, pre-3.10
rules for the parsing GeoJSON polygons. This allows you to let old indexes
produce the same, potentially wrong results as before an upgrade. A geo index
with `legacyPolygons` set to `false` will use the new, correct and consistent
method for parsing of GeoJSON polygons.

If you use a geo index and upgrade from a version below 3.10 to a version of
3.10 or higher, it is recommended that you drop your old geo indexes
and create new ones with `legacyPolygons` set to `false`.

{% hint 'warning' %}
It is possible that you might have been relying on the old (wrong) parsing of
GeoJSON polygons unknowingly. If you have polygons in your data that mean to
refer to a relatively small region, but have the boundary running clockwise
around the intended interior, they would have been interpreted as intended prior
to 3.10, but from 3.10 on, they would be interpreted as "the other side" of the
boundary.

Whether a clockwise boundary specifies the complement of the small region
intentionally or not cannot be determined automatically. Please test the new
behavior manually.
{% endhint %}

Indexed GeoSpatial Queries
--------------------------

The geospatial index supports a variety of AQL queries, which can be built with the help
of the [geo utility functions](aql/functions-geo.html). There are three specific
geo functions that can be optimized, provided they are used correctly:
`GEO_DISTANCE()`, `GEO_CONTAINS()`, `GEO_INTERSECTS()`. Additionally, there is a built-in support to optimize
the older geo functions `DISTANCE()`, `NEAR()`, and `WITHIN()` (the last two
only if they are used in their 4 argument version, without `distanceName`).

When in doubt whether your query is being properly optimized, 
check the [AQL explain](aql/execution-and-performance-explaining-queries.html)
output to check for index usage.

### Query for Results near Origin (NEAR type query)

A basic example of a query for results near an origin point:

```aql
FOR x IN geo_collection
  FILTER GEO_DISTANCE([@lng, @lat], x.geometry) <= 100000
  RETURN x._key
```

or

```aql
FOR x IN geo_collection
  FILTER GEO_DISTANCE(@geojson, x.geometry) <= 100000
  RETURN x._key
```

The function `GEO_DISTANCE()` always returns the distance in meters, so this
query will receive results up until _100km_.

The first parameter can be a GeoJSON object or a coordinate array in
`[longitude, latitude]` ordering. The second parameter is the document field
on that the index was created.

In case of a GeoJSON object in the first parameter, the distance is measured
from the **centroid of the object to the indexed point**. If the index has
`geoJson` set to `true`, then the distance is measured from the
**centroid of the object to the centroid of the indexed object**. This can
be unexpected if not all GeoJSON objects are points, but it is what the index
can actually provide.

### Query for Sorted Results near Origin (NEAR type query)

A basic example of a query for the 1000 nearest results to an origin point (ascending sorting):

```aql
FOR x IN geo_collection
  SORT GEO_DISTANCE([@lng, @lat], x.geometry) ASC
  LIMIT 1000
  RETURN x._key
```

The first parameter can be a GeoJSON object or a coordinate array in
`[longitude, latitude]` ordering. The second parameter is the document field
on that the index was created.

In case of a GeoJSON object in the first parameter, the distance is measured
from the **centroid of the object to the indexed point**. If the index has
`geoJson` set to `true`, then the distance is measured from the
**centroid of the object to the centroid of the indexed object**. This can
be unexpected if not all GeoJSON objects are points, but it is what the index
can actually provide.

You may also get results farthest away (distance sorted in descending order):

```aql
FOR x IN geo_collection
  SORT GEO_DISTANCE([@lng, @lat], x.geometry) DESC
  LIMIT 1000
  RETURN x._key
```

### Query for Results within a Distance Range

A query which returns documents at a distance of _1km_ or farther away,
and up to _100km_ from the origin: 

```aql
FOR x IN geo_collection
  FILTER GEO_DISTANCE([@lng, @lat], x.geometry) <= 100000
  FILTER GEO_DISTANCE([@lng, @lat], x.geometry) >= 1000
  RETURN x
```

This will return the documents with a GeoJSON value that is located in
the specified search annulus.

The first parameter can be a GeoJSON object or a coordinate array in
`[longitude, latitude]` ordering. The second parameter is the document field
on that the index was created.

In case of a GeoJSON object in the first parameter, the distance is measured
from the **centroid of the object to the indexed point**. If the index has
`geoJson` set to `true`, then the distance is measured from the
**centroid of the object to the centroid of the indexed object**. This can
be unexpected if not all GeoJSON objects are points, but it is what the index
can actually provide.

Note that all these `FILTER GEO_DISTANCE(...)` queries can be combined with a
`SORT` clause on `GEO_DISTANCE()` (provided they use the same basis point),
resulting in a sequence of findings sorted by distance, but limited to the given
`GEO_DISTANCE()` boundaries.

### Query for Results contained in Polygon

A query which returns documents whose stored geometry is contained within a
GeoJSON Polygon.

```aql
LET polygon = GEO_POLYGON([[[60,35],[50,5],[75,10],[70,35]]])
FOR x IN geo_collection
  FILTER GEO_CONTAINS(polygon, x.geometry)
  RETURN x
```

The first parameter of `GEO_CONTAINS()` must be a polygon. Other types
are not really sensible, since for example a point cannot contain other GeoJSON
objects than itself, and for others like lines, containment is not defined in a
numerically stable way. The second parameter must contain the document field on
that the index was created.

This `FILTER` clause can be combined with a `SORT` clause using `GEO_DISTANCE()`.

Note that containment in the opposite direction is currently not supported by
geo indexes:

```aql
LET polygon = GEO_POLYGON([[[60,35],[50,5],[75,10],[70,35]]])
FOR x IN geo_collection
  FILTER GEO_CONTAINS(x.geometry, polygon)
  RETURN x
```

### Query for Results Intersecting a Polygon

A query that returns documents with an intersection of their stored
geometry and a GeoJSON Polygon.

```aql
LET polygon = GEO_POLYGON([[[60,35],[50,5],[75,10],[70,35]]])
FOR x IN geo_collection
  FILTER GEO_INTERSECTS(polygon, x.geometry)
  RETURN x
```

The first parameter of `GEO_INTERSECTS()` will usually be a polygon.

The second parameter must contain the document field on that the index
was created.

This `FILTER` clause can be combined with a `SORT` clause using `GEO_DISTANCE()`.

GeoJSON
-------

GeoJSON is a geospatial data format based on JSON. It defines several different
types of JSON objects and the way in which they can be combined to represent
data about geographic shapes on the Earth surface. GeoJSON uses a geographic
coordinate reference system, World Geodetic System 1984 (WGS 84), and units of decimal
degrees.

Internally ArangoDB maps all coordinates onto a unit sphere. Distances are
projected onto a sphere with the Earth's *Volumetric mean radius* of *6371
km*. ArangoDB implements a useful subset of the GeoJSON format
[(RFC 7946)](https://tools.ietf.org/html/rfc7946){:target="_blank"}.
Feature Objects and the GeometryCollection type are not supported.
Supported geometry object types are:

- Point
- MultiPoint
- LineString
- MultiLineString
- Polygon
- MultiPolygon

### GeoJSON interpretation

Note the following technical detail about GeoJSON: The
[GeoJSON standard, Section 3.1.1 Position](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.1){:target="_blank"}
prescribes that lines are **cartesian lines in cylindrical coordinates**
(longitude/latitude). However, this definition is inconvenient in practice,
since such lines are not geodesic on the surface of the Earth.
Furthermore, the best available algorithms for geospatial computations on Earth
typically use geodesic lines as the boundaries of polygons on Earth.

Therefore, ArangoDB uses the **syntax of the GeoJSON** standard,
but then interprets lines (and boundaries of polygons) as
**geodesic lines (pieces of great circles) on Earth**. This is a
violation of the GeoJSON standard, but serving a practical purpose.

Note in particular that this can sometimes lead to unexpected results.
Consider the following polygon (remember that GeoJSON has
**longitude before latitude** in coordinates):

```json
{ "type": "Polygon", "coordinates": [[
  [10, 40], [20, 40], [20, 50], [10, 50], [10, 40]
]] }
```

It does not contain the point `[15, 40]`, since the shortest path
(geodesic) from `[10, 40]` to `[20, 40]` lies North of the parallel of
latitude with latitude 40. On the contrary, the polygon contains the
point `[15, 50]` for a similar reason.

{% hint 'info' %}
ArangoDB version before 3.10 did an inconsistent special detection of such
polygons that later versions from 3.10 onward no longer do, see
[Legacy Polygons](#legacy-polygons).
{% endhint %}

Furthermore, there is an issue with the interpretation of linear rings
(boundaries of polygons) according to
[GeoJSON standard, Section 3.1.6 Polygon](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.6){:target="_blank"}.
This section states explicitly:

> A linear ring MUST follow the right-hand rule with respect to the
> area it bounds, i.e., exterior rings are counterclockwise, and
> holes are clockwise.

This rather misleading phrase means that when a linear ring is used as
the boundary of a polygon, the "interior" of the polygon lies to the
left of the boundary when one travels on the surface of the Earth and
along the linear ring. For
example, the polygon above travels counter-clockwise around the point
`[15, 45]`, and thus the interior of the polygon contains this point and
its surroundings, but not, for example, the North Pole and the South
Pole.

On the contrary, the following polygon travels clock-wise around the point
`[15, 45]`, and thus its "interior" does not contain `[15, 45]`, but does
contain the North Pole and the South Pole:

```json
{ "type": "Polygon", "coordinates": [[
  [10, 40], [10, 50], [20, 50], [20, 40], [10, 40] ]] }
```

Remember that the "interior" is to the left of the given
linear ring, so this second polygon is basically the complement on Earth
of the previous polygon!

ArangoDB versions before 3.10 did not follow this rule and always took the
"smaller" connected component of the surface as the "interior" of the polygon.
This made it impossible to specify polygons which covered more than half of the
sphere. From version 3.10 onward, ArangoDB recognizes this correctly.
See [Legacy Polygons](#legacy-polygons) for how to deal with this issue.

### Point

A [GeoJSON Point](https://tools.ietf.org/html/rfc7946#section-3.1.2){:target="_blank"} is a
[position](https://tools.ietf.org/html/rfc7946#section-3.1.1){:target="_blank"} comprised of
a longitude and a latitude:

```json
{
  "type": "Point",
  "coordinates": [100.0, 0.0]
}
```

### MultiPoint

A [GeoJSON MultiPoint](https://tools.ietf.org/html/rfc7946#section-3.1.7){:target="_blank"} is
an array of positions:

```json
{
  "type": "MultiPoint",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}
```

### LineString

A [GeoJSON LineString](https://tools.ietf.org/html/rfc7946#section-3.1.4){:target="_blank"} is
an array of two or more positions:

```json
{
  "type": "LineString",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}
```

### MultiLineString

A [GeoJSON MultiLineString](https://tools.ietf.org/html/rfc7946#section-3.1.5){:target="_blank"} is
an array of LineString coordinate arrays:

```json
{
  "type": "MultiLineString",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 1.0]
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0]
    ]
  ]
}
```

### Polygon

A [GeoJSON Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6){:target="_blank"} consists
of a series of closed `LineString` objects (ring-like). These *Linear Ring*
objects consist of four or more vertices with the first and last
coordinate pairs being equal. Coordinates of a Polygon are an array of
linear ring coordinate arrays. The first element in the array represents
the exterior ring. Any subsequent elements represent interior rings
(holes within the surface).

The orientation of the first linear ring is crucial: the right-hand-rule
is applied, so that the area to the left of the path of the linear ring
(when walking on the surface of the Earth) is considered to be the
"interior" of the polygon. All other linear rings must be contained
within this interior. According to the GeoJSON standard, the subsequent
linear rings must be oriented following the right-hand-rule, too,
that is, they must run **clockwise** around the hole (viewed from
above). However, ArangoDB is tolerant here (as suggested by the
[GeoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.6)),
all but the first linear ring are inverted if the orientation is wrong.

In the end, a point is considered to be in the interior of the polygon,
if and only if one has to cross an odd number of linear rings to reach the
exterior of the polygon prescribed by the first linear ring.

A number of additional rules apply (and are enforced by the GeoJSON
parser):

- A polygon must contain at least one linear ring, i.e., it must not be
  empty.
- A linear ring may not be empty, it needs at least three _distinct_
  coordinates, that is, at least 4 coordinate pairs (since the first and
  last must be the same).
- No two edges of linear rings in the polygon must intersect, in
  particular, no linear ring may be self-intersecting.
- Within the same linear ring consecutive coordinates may be the same,
  otherwise (except the first and last one) all coordinates need to be
  distinct.
- Linear rings of a polygon must not share edges, they may however share
  vertices.
- A linear ring defines two regions on the sphere. ArangoDB will always
  interpret the region that lies to the left of the boundary ring (in
  the direction of its travel on the surface of the Earth) as the
  interior of the ring. This is in contrast to earlier versions of
  ArangoDB before 3.10, which always took the **smaller** of the two
  regions as the interior. Therefore, from 3.10 on one can now have
  polygons whose outer ring encloses more than half the Earth's surface.
- The interior rings must be contained in the (interior) of the outer ring.
- Interior rings should follow the above rule for orientation
  (counterclockwise external rings, clockwise internal rings, interior
  always to the left of the line).

Here is an example with no holes:

```json
{
  "type": "Polygon",
    "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ]
  ]
}
```

Here is an example with a hole:

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ],
    [
      [100.8, 0.8],
      [100.8, 0.2],
      [100.2, 0.2],
      [100.2, 0.8],
      [100.8, 0.8]
    ]
  ]
}
```

### MultiPolygon

A [GeoJSON MultiPolygon](https://tools.ietf.org/html/rfc7946#section-3.1.6){:target="_blank"} consists
of multiple polygons. The "coordinates" member is an array of
_Polygon_ coordinate arrays. See [above](#polygon) for the rules and
the meaning of polygons.

If the polygons in a MultiPolygon are disjoint, then a point is in the
interior of the MultiPolygon if and only if it is
contained in one of the polygons. If some polygon P2 in a MultiPolygon
is contained in another polygon P1, then P2 is treated like a hole
in P1 and containment of points is defined with the even-odd-crossings rule
(see [Polygon](#polygon)).

Additionally, the following rules apply and are enforced for
MultiPolygons:

- No two edges in the linear rings of the polygons of a MultiPolygon
  may intersect.
- Polygons in the same MultiPolygon may not share edges, they may share
  coordinates.

Example with two polygons, the second one with a hole:

```json
{
    "type": "MultiPolygon",
    "coordinates": [
        [
            [
                [102.0, 2.0],
                [103.0, 2.0],
                [103.0, 3.0],
                [102.0, 3.0],
                [102.0, 2.0]
            ]
        ],
        [
            [
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0]
            ],
            [
                [100.2, 0.2],
                [100.2, 0.8],
                [100.8, 0.8],
                [100.8, 0.2],
                [100.2, 0.2]
            ]
        ]
    ]
}
```

_arangosh_ Examples
-------------------

Ensures that a geo index exists:

`collection.ensureIndex({ type: "geo", fields: [ "location" ] })`

Creates a geospatial index on all documents using `location` as the path to the
coordinates. The value of the attribute has to be an array with at least two
numeric values. The array must contain the latitude (first value) and the
longitude (second value).

All documents, which do not have the attribute path or have a non-conforming
value in it, are excluded from the index.

A geo index is implicitly sparse, and there is no way to control its
sparsity.

The index does not provide a `unique` option because of its limited usability.
It would prevent identical coordinates from being inserted only, but even a
slightly different location (like 1 inch or 1 cm off) would be unique again and
not considered a duplicate, although it probably should. The desired threshold
for detecting duplicates may vary for every project (including how to calculate
the distance even) and needs to be implemented on the application layer as
needed. You can write a [Foxx service](foxx.html) for this purpose and
make use of the AQL [geo functions](aql/functions-geo.html) to find nearby
coordinates supported by a geo index.

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

---

To create a geo index on an array attribute that contains longitude first, set
the `geoJson` attribute to `true`. This corresponds to the format described in
[RFC 7946 Position](https://tools.ietf.org/html/rfc7946#section-3.1.1){:target="_blank"}

`collection.ensureIndex({ type: "geo", fields: [ "location" ], geoJson: true })`

---

To create a geo-spatial index on all documents using `latitude` and `longitude`
as separate attribute paths, two paths need to be specified in the `fields`
array:

`collection.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] })`

In case that the index was successfully created, an object with the index
details, including the index-identifier, is returned.

**Examples**

Create a geo index for an array attribute:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline geoIndexCreateForArrayAttribute1
    @EXAMPLE_ARANGOSH_OUTPUT{geoIndexCreateForArrayAttribute1}
    ~db._create("geo")
     db.geo.ensureIndex({ type: "geo", fields: [ "loc" ] });
    ~db._drop("geo")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock geoIndexCreateForArrayAttribute1
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Create a geo index for an array attribute:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline geoIndexCreateForArrayAttribute2
    @EXAMPLE_ARANGOSH_OUTPUT{geoIndexCreateForArrayAttribute2}
    ~db._create("geo2")
    db.geo2.ensureIndex({ type: "geo", fields: [ "location.latitude", "location.longitude" ] });
    ~db._drop("geo2")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock geoIndexCreateForArrayAttribute2
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Use geo index with AQL SORT statement:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline geoIndexSortOptimization
    @EXAMPLE_ARANGOSH_OUTPUT{geoIndexSortOptimization}
    ~db._create("geoSort")
    db.geoSort.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] });
    | for (i = -90;  i <= 90;  i += 10) {
    |     for (j = -180; j <= 180; j += 10) {
    |         db.geoSort.save({ name : "Name/" + i + "/" + j, latitude : i, longitude : j });
    |     }
      }
    var query = "FOR doc in geoSort SORT DISTANCE(doc.latitude, doc.longitude, 0, 0) LIMIT 5 RETURN doc"
    db._explain(query, {}, {colors: false});
    db._query(query);
    ~db._drop("geoSort")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock geoIndexSortOptimization
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

Use geo index with AQL FILTER statement:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline geoIndexFilterOptimization
    @EXAMPLE_ARANGOSH_OUTPUT{geoIndexFilterOptimization}
    ~db._create("geoFilter")
    db.geoFilter.ensureIndex({ type: "geo", fields: [ "latitude", "longitude" ] });
    | for (i = -90;  i <= 90;  i += 10) {
    |     for (j = -180; j <= 180; j += 10) {
    |         db.geoFilter.save({ name : "Name/" + i + "/" + j, latitude : i, longitude : j });
    |     }
      }
    var query = "FOR doc in geoFilter FILTER DISTANCE(doc.latitude, doc.longitude, 0, 0) < 2000 RETURN doc"
    db._explain(query, {}, {colors: false});
    db._query(query);
    ~db._drop("geoFilter")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock geoIndexFilterOptimization
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
