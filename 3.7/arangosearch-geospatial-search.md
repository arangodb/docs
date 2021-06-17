---
layout: default
description: ArangoSearch supports geospatial queries to find coordinates and GeoJSON shapes within a radius or area
title: Geospatial Search ArangoSearch Examples
---
# Geospatial Search with ArangoSearch

{{ page.description }}
{:class="lead"}

## Search for points within a radius

```js
LET moma = GEO_POINT(-73.983, 40.764)
FOR doc IN restaurantsView
  SEARCH ANALYZER(GEO_DISTANCE(doc.location, moma) < 100, "geojson")
  LET distance = GEO_DISTANCE(doc.location, moma)
  SORT distance
  RETURN {
    geometry: doc.location,
    distance
  }
```

## Search for points within a polygon

```js
LET upperWestSide = FIRST(
  FOR doc IN restaurantsView
    SEARCH ANALYZER(doc.name == "Upper West Side", "identity")
    RETURN doc.geometry
)
FOR result IN PUSH(
  FOR doc IN restaurantsView
    SEARCH ANALYZER(GEO_CONTAINS(upperWestSide, doc.location), "geojson")
    RETURN doc.location,
  upperWestSide
)
  RETURN result
```

## Search for polygons within polygons

```js
LET sides = {
  left: -74,
  top: 40.8,
  right: -73.93,
  bottom: 40.76
}

LET rect = GEO_POLYGON([
  [sides.left, sides.bottom],
  [sides.left, sides.top],
  [sides.right, sides.top],
  [sides.right, sides.bottom],
  [sides.left, sides.bottom]
])

FOR result IN PUSH(
  FOR doc IN restaurantsView
    SEARCH ANALYZER(GEO_CONTAINS(rect, doc.geometry), "geojson")
    RETURN doc.geometry,
  rect
)
  RETURN result
```

## Search for polygons intersecting polygons

```js
LET sides = {
  left: -74,
  top: 40.8,
  right: -73.93,
  bottom: 40.76
}

LET rect = GEO_POLYGON([
  [sides.left, sides.bottom],
  [sides.left, sides.top],
  [sides.right, sides.top],
  [sides.right, sides.bottom],
  [sides.left, sides.bottom]
])

FOR result IN PUSH(
  FOR doc IN restaurantsView
    SEARCH ANALYZER(GEO_INTERSECTS(rect, doc.geometry), "geojson")
    RETURN doc.geometry,
  rect
)
  RETURN result
```

**Dataset:** [IMDB movie dataset](arangosearch-example-datasets.html#imdb-movie-dataset)
