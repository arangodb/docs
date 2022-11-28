---
fileID: indexes-geo
title: Working with Geo Indexes
weight: 2380
description: 
layout: default
---
<!-- js/actions/api-index.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/index#geo:
    post:
      description: |2+
        Creates a geo-spatial index in the collection *collection-name*, if
        it does not already exist. Expects an object containing the index details.
        Geo indexes are always sparse, meaning that documents that do not contain
        the index attributes or have non-numeric values in the index attributes
        will not be indexed.
      operationId: ' createIndex#geo'
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The collection name.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                  description: |+
                    must be equal to *"geo"*.
                fields:
                  type: array
                  description: |+
                    An array with one or two attribute paths.
                    If it is an array with one attribute path *location*, then a geo-spatial
                    index on all documents is created using *location* as path to the
                    coordinates. The value of the attribute must be an array with at least two
                    double values. The array must contain the latitude (first value) and the
                    longitude (second value). All documents, which do not have the attribute
                    path or with value that are not suitable, are ignored.
                    If it is an array with two attribute paths *latitude* and *longitude*,
                    then a geo-spatial index on all documents is created using *latitude*
                    and *longitude* as paths the latitude and the longitude. The value of
                    the attribute *latitude* and of the attribute *longitude* must a
                    double. All documents, which do not have the attribute paths or which
                    values are not suitable, are ignored.
                geoJson:
                  type: string
                  description: |+
                    If a geo-spatial index on a *location* is constructed
                    and *geoJson* is *true*, then the order within the array is longitude
                    followed by latitude. This corresponds to the format described in
                    http//geojson.org/geojson-spec.html#positions
                inBackground:
                  type: boolean
                  description: |+
                    The optional attribute **inBackground** can be set to *true* to create the index
                    in the background, which will not write-lock the underlying collection for
                    as long as if the index is built in the foreground. The default value is *false*.
              required:
              - type
              - fields
      responses:
        '200':
          description: |2+
            If the index already exists, then a *HTTP 200* is returned.
        '201':
          description: |2+
            If the index does not already exist and could be created, then a *HTTP 201*
            is returned.
      tags:
      - Indexes
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestIndexCreateGeoLocation
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/index?collection=" + cn;
    var body = {
      type: "geo",
      fields : [ "b" ]
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestIndexCreateGeoLatitudeLongitude
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/index?collection=" + cn;
    var body = {
      type: "geo",
      fields: [ "e", "f" ]
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

