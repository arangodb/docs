---
fileID: foxx-miscellaneous
title: Foxx Service Miscellaneous
weight: 2305
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/scripts:
    get:
      description: |2+
        Fetches a list of the scripts defined by the service.
        Returns an object mapping the raw script names to human-friendly names.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/scripts/{name}:
    post:
      description: |2+
        Runs the given script for the service at the given mount path.
        Returns the exports of the script, if any.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  description: |+
                    An arbitrary JSON value that will be parsed and passed to the
                    script as its first argument.
              required: []
      parameters:
      - name: name
        schema:
          type: string
        required: true
        description: |+
          Name of the script to run.
        in: path
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/tests:
    post:
      description: |2+
        Runs the tests for the service at the given mount path and returns the results.
        Supported test reporters are:
        - *default*: a simple list of test cases
        - *suite*: an object of test cases nested in suites
        - *stream*: a raw stream of test results
        - *xunit*: an XUnit/JUnit compatible structure
        - *tap*: a raw TAP compatible stream
        The *Accept* request header can be used to further control the response format:
        When using the *stream* reporter `application/x-ldjson` will result
        in the response body being formatted as a newline-delimited JSON stream.
        When using the *tap* reporter `text/plain` or `text/*` will result
        in the response body being formatted as a plain text TAP report.
        When using the *xunit* reporter `application/xml` or `text/xml` will result
        in the response body being formatted as XML instead of JSONML.
        Otherwise the response body will be formatted as non-prettyprinted JSON.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      - name: reporter
        schema:
          type: string
        required: false
        description: |+
          Test reporter to use.
        in: query
      - name: idiomatic
        schema:
          type: boolean
        required: false
        description: |+
          Use the matching format for the reporter, regardless of the *Accept* header.
        in: query
      - name: filter
        schema:
          type: string
        required: false
        description: |+
          Only run tests where the full name (including full test suites and test case)
          matches this string.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/development:
    post:
      description: |2+
        Puts the service into development mode.
        While the service is running in development mode the service will be reloaded
        from the filesystem and its setup script (if any) will be re-executed every
        time the service handles a request.
        When running ArangoDB in a cluster with multiple Coordinators note that changes
        to the filesystem on one Coordinator will not be reflected across the other
        Coordinators. This means you should treat your Coordinators as inconsistent
        as long as any service is running in development mode.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/development:
    delete:
      description: |2+
        Puts the service at the given mount path into production mode.
        When running ArangoDB in a cluster with multiple Coordinators this will
        replace the service on all other Coordinators with the version on this
        Coordinator.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/readme:
    get:
      description: |2+
        Fetches the service's README or README.md file's contents if any.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      responses:
        '200':
          description: |2+
            Returned if the request was successful.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/swagger:
    get:
      description: |2+
        Fetches the Swagger API description for the service at the given mount path.
        The response body will be an OpenAPI 2.0 compatible JSON description of the service API.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/download:
    post:
      description: |2+
        Downloads a zip bundle of the service directory.
        When development mode is enabled, this always creates a new bundle.
        Otherwise the bundle will represent the version of a service that
        is installed on that ArangoDB instance.
      parameters:
      - name: mount
        schema:
          type: string
        required: true
        description: |+
          Mount path of the installed service.
        in: query
      responses:
        '200':
          description: |2+
            Returned if the request was successful.
      tags:
      - Foxx
```


```http-spec
openapi: 3.0.2
paths:
  /_api/foxx/commit:
    post:
      description: |2+
        Commits the local service state of the Coordinator to the database.
        This can be used to resolve service conflicts between Coordinators that can not be fixed automatically due to missing data.
      parameters:
      - name: replace
        schema:
          type: boolean
        required: false
        description: |+
          Overwrite existing service files in database even if they already exist.
        in: query
      tags:
      - Foxx
```


