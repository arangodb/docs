---
fileID: aql-query-cache
title: HTTP Interface for the AQL query results cache
weight: 2045
description: 
layout: default
---
This section describes the API methods for controlling the AQL query results cache.
```http-spec
openapi: 3.0.2
paths:
  /_api/query-cache/entries:
    get:
      description: |2+
        Returns an array containing the AQL query results currently stored in the query results
        cache of the selected database. Each result is a JSON object with the following attributes:
        - *hash*: the query result's hash
        - *query*: the query string
        - *bindVars*: the query's bind parameters. this attribute is only shown if tracking for
          bind variables was enabled at server start
        - *size*: the size of the query result and bind parameters, in bytes
        - *results*: number of documents/rows in the query result
        - *started*: the date and time when the query was stored in the cache
        - *hits*: number of times the result was served from the cache (can be
          *0* for queries that were only stored in the cache but were never accessed
          again afterwards)
        - *runTime*: the query's run time
        - *dataSources*: an array of collections/Views the query was using
      operationId: ' readQueries'
      responses:
        '200':
          description: |2
            Is returned when the list of results can be retrieved successfully.
        '400':
          description: |2
            The server will respond with *HTTP 400* in case of a malformed request,
      tags:
      - AQL
```


```http-spec
openapi: 3.0.2
paths:
  /_api/query-cache:
    delete:
      description: |2
        clears the query results cache for the current database
      operationId: ' clearCache'
      responses:
        '200':
          description: |2
            The server will respond with *HTTP 200* when the cache was cleared
            successfully.
        '400':
          description: |2
            The server will respond with *HTTP 400* in case of a malformed request.
      tags:
      - AQL
```


```http-spec
openapi: 3.0.2
paths:
  /_api/query-cache/properties:
    get:
      description: |2+
        Returns the global AQL query results cache configuration. The configuration is a
        JSON object with the following properties:
        - *mode*: the mode the AQL query results cache operates in. The mode is one of the following
          values: *off*, *on* or *demand*.
        - *maxResults*: the maximum number of query results that will be stored per database-specific
          cache.
        - *maxResultsSize*: the maximum cumulated size of query results that will be stored per
          database-specific cache.
        - *maxEntrySize*: the maximum individual result size of queries that will be stored per
          database-specific cache.
        - *includeSystem*: whether or not results of queries that involve system collections will be
          stored in the query results cache.
      operationId: ' readProperties'
      responses:
        '200':
          description: |2
            Is returned if the properties can be retrieved successfully.
        '400':
          description: |2
            The server will respond with *HTTP 400* in case of a malformed request,
      tags:
      - AQL
```


```http-spec
openapi: 3.0.2
paths:
  /_api/query-cache/properties:
    put:
      description: |2+
        After the properties have been changed, the current set of properties will
        be returned in the HTTP response.
        Note: changing the properties may invalidate all results in the cache.
        The global properties for AQL query cache.
        The properties need to be passed in the attribute *properties* in the body
        of the HTTP request. *properties* needs to be a JSON object with the following
        properties:
      operationId: ' replaceProperties:QueryCache'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                mode:
                  type: string
                  description: |2+
                     the mode the AQL query cache should operate in. Possible values are *off*, *on* or *demand*.
                maxResults:
                  type: integer
                  format: int64
                  description: |+
                    the maximum number of query results that will be stored per database-specific cache.
                maxResultsSize:
                  type: integer
                  format: int64
                  description: |+
                    the maximum cumulated size of query results that will be stored per database-specific cache.
                maxEntrySize:
                  type: integer
                  format: int64
                  description: |+
                    the maximum individual size of query results that will be stored per database-specific cache.
                includeSystem:
                  type: boolean
                  description: |+
                    whether or not to store results of queries that involve system collections.
              required: []
      responses:
        '200':
          description: |2
            Is returned if the properties were changed successfully.
        '400':
          description: |2
            The server will respond with *HTTP 400* in case of a malformed request,
      tags:
      - AQL
```



