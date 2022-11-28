---
fileID: aql-query
title: HTTP Interface for AQL Queries
weight: 2310
description: 
layout: default
---
### Explaining and parsing queries

ArangoDB has an HTTP interface to syntactically validate AQL queries.
Furthermore, it offers an HTTP interface to retrieve the execution plan for any
valid AQL query.

Both functionalities do not actually execute the supplied AQL query, but only
inspect it and return meta information about it.

You can also retrieve a list of all query optimizer rules and their properties.

<!-- js/actions/api-explain.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/explain:
    post:
      description: |2+
        To explain how an AQL query would be executed on the server, the query string
        can be sent to the server via an HTTP POST request. The server will then validate
        the query and create an execution plan for it. The execution plan will be
        returned, but the query will not be executed.
        The execution plan that is returned by the server can be used to estimate the
        probable performance of the query. Though the actual performance will depend
        on many different factors, the execution plan normally can provide some rough
        estimates on the amount of work the server needs to do in order to actually run
        the query.
        By default, the explain operation will return the optimal plan as chosen by
        the query optimizer The optimal plan is the plan with the lowest total estimated
        cost. The plan will be returned in the attribute *plan* of the response object.
        If the option *allPlans* is specified in the request, the result will contain
        all plans created by the optimizer. The plans will then be returned in the
        attribute *plans*.
        The result will also contain an attribute *warnings*, which is an array of
        warnings that occurred during optimization or execution plan creation. Additionally,
        a *stats* attribute is contained in the result with some optimizer statistics.
        If *allPlans* is set to *false*, the result will contain an attribute *cacheable*
        that states whether the query results can be cached on the server if the query
        result cache were used. The *cacheable* attribute is not present when *allPlans*
        is set to *true*.
        Each plan in the result is a JSON object with the following attributes:
        - *nodes*: the array of execution nodes of the plan.
        - *estimatedCost*: the total estimated cost for the plan. If there are multiple
          plans, the optimizer will choose the plan with the lowest total cost.
        - *collections*: an array of collections used in the query
        - *rules*: an array of rules the optimizer applied.
        - *variables*: array of variables used in the query (note: this may contain
          internal variables created by the optimizer)
      operationId: ' explainQuery'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: |+
                    the query which you want explained; If the query references any bind variables,
                    these must also be passed in the attribute *bindVars*. Additional
                    options for the query can be passed in the *options* attribute.
                bindVars:
                  type: array
                  description: |+
                    key/value pairs representing the bind parameters.
                options:
                  type: object
                  schema:
                    $ref: '#/components/schemas/explain_options'
                  description: |+
                    Options for the query
              required:
              - query
      responses:
        '200':
          description: |2+
            If the query is valid, the server will respond with *HTTP 200* and
            return the optimal execution plan in the *plan* attribute of the response.
            If option *allPlans* was set in the request, an array of plans will be returned
            in the *allPlans* attribute instead.
        '400':
          description: |2+
            The server will respond with *HTTP 400* in case of a malformed request,
            or if the query contains a parse error. The body of the response will
            contain the error details embedded in a JSON object.
            Omitting bind variables if the query references any will also result
            in an *HTTP 400* error.
      tags:
      - AQL
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestExplainValid
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    for (var i = 0; i < 10; ++i) { db.products.save({ id: i }); }
    body = {
      query : "FOR p IN products RETURN p"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
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
name: RestExplainOptimizerRules
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.ensureIndex({ type: "persistent", fields: ["id"] });
    for (var i = 0; i < 10; ++i) { db.products.save({ id: i }); }
    body = {
      query : "FOR p IN products LET a = p.id FILTER a == 4 LET name = p.name SORT p.id LIMIT 1 RETURN name",
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
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
name: RestExplainOptions
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.ensureIndex({ type: "persistent", fields: ["id"] });
    for (var i = 0; i < 10; ++i) { db.products.save({ id: i }); }
    body = {
      query : "FOR p IN products LET a = p.id FILTER a == 4 LET name = p.name SORT p.id LIMIT 1 RETURN name",
      options : {
        maxNumberOfPlans : 2,
        allPlans : true,
        optimizer : {
          rules: [ "-all", "+use-index-for-sort", "+use-index-range" ]
        }
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
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
name: RestExplainAllPlans
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    db.products.ensureIndex({ type: "persistent", fields: ["id"] });
    body = {
      query : "FOR p IN products FILTER p.id == 25 RETURN p",
      options: {
        allPlans: true
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
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
name: RestExplainWarning
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    body = {
      query : "FOR i IN 1..10 RETURN 1 / 0"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
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
name: RestExplainInvalid
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    var cn = "products";
    db._drop(cn);
    db._create(cn);
    body = {
      query : "FOR p IN products FILTER p.id == @id LIMIT 2 RETURN p.n"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 400);
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
name: RestExplainEmpty
release: stable
version: '3.10'
---
    var url = "/_api/explain";
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    body = '{ "query" : "FOR i IN [ 1, 2, 3 ] FILTER 1 == 2 RETURN i" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/query:
    post:
      description: |2+
        This endpoint is for query validation only. To actually query the database,
        see `/api/cursor`.
      operationId: ' parseQuery'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: |+
                    To validate a query string without executing it, the query string can be
                    passed to the server via an HTTP POST request.
              required:
              - query
      responses:
        '200':
          description: |2+
            If the query is valid, the server will respond with *HTTP 200* and
            return the names of the bind parameters it found in the query (if any) in
            the *bindVars* attribute of the response. It will also return an array
            of the collections used in the query in the *collections* attribute.
            If a query can be parsed successfully, the *ast* attribute of the returned
            JSON will contain the abstract syntax tree representation of the query.
            The format of the *ast* is subject to change in future versions of
            ArangoDB, but it can be used to inspect how ArangoDB interprets a given
            query. Note that the abstract syntax tree will be returned without any
            optimizations applied to it.
      tags:
      - AQL
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestQueryValid
release: stable
version: '3.10'
---
    var url = "/_api/query";
    var body = '{ "query" : "FOR i IN 1..100 FILTER i > 10 LIMIT 2 RETURN i * 3" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
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
name: RestQueryInvalid
release: stable
version: '3.10'
---
    var url = "/_api/query";
    var body = '{ "query" : "FOR i IN 1..100 FILTER i = 1 LIMIT 2 RETURN i * 3" }';
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 400);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_api/query/rules:
    get:
      description: |2+
        A list of all optimizer rules and their properties.
      operationId: ' queryRules'
      responses:
        '200':
          description: |2+
            is returned if the list of optimizer rules can be retrieved successfully.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/get_api_query_rules'
      tags:
      - AQL
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestQueryRules
release: stable
version: '3.10'
---
    var url = "/_api/query/rules";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


### Query tracking

ArangoDB has an HTTP interface for retrieving the lists of currently
executing AQL queries and the list of slow AQL queries. In order to make meaningful
use of these APIs, query tracking needs to be enabled in the database the HTTP 
request is executed for.

<!--arangod/RestHandler/RestQueryHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/query/properties:
    get:
      description: |2+
        Returns the current query tracking configuration. The configuration is a
        JSON object with the following properties:
        - *enabled*: if set to *true*, then queries will be tracked. If set to
          *false*, neither queries nor slow queries will be tracked.
        - *trackSlowQueries*: if set to *true*, then slow queries will be tracked
          in the list of slow queries if their runtime exceeds the value set in
          *slowQueryThreshold*. In order for slow queries to be tracked, the *enabled*
          property must also be set to *true*.
        - *trackBindVars*: if set to *true*, then bind variables used in queries will
          be tracked.
        - *maxSlowQueries*: the maximum number of slow queries to keep in the list
          of slow queries. If the list of slow queries is full, the oldest entry in
          it will be discarded when additional slow queries occur.
        - *slowQueryThreshold*: the threshold value for treating a query as slow. A
          query with a runtime greater or equal to this threshold value will be
          put into the list of slow queries when slow query tracking is enabled.
          The value for *slowQueryThreshold* is specified in seconds.
        - *maxQueryStringLength*: the maximum query string length to keep in the
          list of queries. Query strings can have arbitrary lengths, and this property
          can be used to save memory in case very long query strings are used. The
          value is specified in bytes.
      operationId: ' readQueryProperties'
      responses:
        '200':
          description: |2+
            Is returned if properties were retrieved successfully.
      tags:
      - AQL
```



<!--arangod/RestHandler/RestQueryHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/query/properties:
    put:
      description: |2+
        The properties need to be passed in the attribute *properties* in the body
        of the HTTP request. *properties* needs to be a JSON object.
        After the properties have been changed, the current set of properties will
        be returned in the HTTP response.
      operationId: ' replaceProperties'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                enabled:
                  type: boolean
                  description: |+
                    If set to *true*, then queries will be tracked. If set to
                    *false*, neither queries nor slow queries will be tracked.
                trackSlowQueries:
                  type: boolean
                  description: |+
                    If set to *true*, then slow queries will be tracked
                    in the list of slow queries if their runtime exceeds the value set in
                    *slowQueryThreshold*. In order for slow queries to be tracked, the *enabled*
                    property must also be set to *true*.
                trackBindVars:
                  type: boolean
                  description: |+
                    If set to *true*, then the bind variables used in queries will be tracked
                    along with queries.
                maxSlowQueries:
                  type: integer
                  description: |+
                    The maximum number of slow queries to keep in the list
                    of slow queries. If the list of slow queries is full, the oldest entry in
                    it will be discarded when additional slow queries occur.
                slowQueryThreshold:
                  type: integer
                  description: |+
                    The threshold value for treating a query as slow. A
                    query with a runtime greater or equal to this threshold value will be
                    put into the list of slow queries when slow query tracking is enabled.
                    The value for *slowQueryThreshold* is specified in seconds.
                maxQueryStringLength:
                  type: integer
                  description: |+
                    The maximum query string length to keep in the list of queries.
                    Query strings can have arbitrary lengths, and this property
                    can be used to save memory in case very long query strings are used. The
                    value is specified in bytes.
              required:
              - enabled
              - trackSlowQueries
              - trackBindVars
              - maxSlowQueries
              - slowQueryThreshold
              - maxQueryStringLength
      responses:
        '200':
          description: |2+
            Is returned if the properties were changed successfully.
      tags:
      - AQL
```



<!--arangod/RestHandler/RestQueryHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/query/current:
    get:
      description: |2+
        Returns an array containing the AQL queries currently running in the selected
        database. Each query is a JSON object with the following attributes:
        - *id*: the query's id
        - *database*: the name of the database the query runs in
        - *user*: the name of the user that started the query
        - *query*: the query string (potentially truncated)
        - *bindVars*: the bind parameter values used by the query
        - *started*: the date and time when the query was started
        - *runTime*: the query's run time up to the point the list of queries was
          queried
        - *state*: the query's current execution state (as a string). One of:
          - `"initializing"`
          - `"parsing"`
          - `"optimizing ast"`
          - `"loading collections"`
          - `"instantiating plan"`
          - `"optimizing plan"`
          - `"executing"`
          - `"finalizing"`
          - `"finished"`
          - `"killed"`
          - `"invalid"`
        - *stream*: whether or not the query uses a streaming cursor
      operationId: ' readQuery:current'
      parameters:
      - name: all
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, will return the currently running queries in all databases,
          not just the selected one.
          Using the parameter is only allowed in the system database and with superuser
          privileges.
        in: query
      responses:
        '200':
          description: |2+
            Is returned when the list of queries can be retrieved successfully.
        '400':
          description: |2+
            The server will respond with *HTTP 400* in case of a malformed request,
      tags:
      - AQL
```



<!--arangod/RestHandler/RestQueryHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/query/slow:
    get:
      description: |2+
        Returns an array containing the last AQL queries that are finished and
        have exceeded the slow query threshold in the selected database.
        The maximum amount of queries in the list can be controlled by setting
        the query tracking property `maxSlowQueries`. The threshold for treating
        a query as *slow* can be adjusted by setting the query tracking property
        `slowQueryThreshold`.
        Each query is a JSON object with the following attributes:
        - *id*: the query's id
        - *database*: the name of the database the query runs in
        - *user*: the name of the user that started the query
        - *query*: the query string (potentially truncated)
        - *bindVars*: the bind parameter values used by the query
        - *started*: the date and time when the query was started
        - *runTime*: the query's total run time
        - *state*: the query's current execution state (will always be "finished"
          for the list of slow queries)
        - *stream*: whether or not the query uses a streaming cursor
      operationId: ' readQuery:Slow'
      parameters:
      - name: all
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, will return the slow queries from all databases, not just
          the selected one.
          Using the parameter is only allowed in the system database and with superuser
          privileges.
        in: query
      responses:
        '200':
          description: |2+
            Is returned when the list of queries can be retrieved successfully.
        '400':
          description: |2+
            The server will respond with *HTTP 400* in case of a malformed request,
      tags:
      - AQL
```



<!--arangod/RestHandler/RestQueryHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/query/slow:
    delete:
      description: |2+
        Clears the list of slow AQL queries in the currently selected database
      operationId: ' deleteSlowQueries'
      parameters:
      - name: all
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, will clear the slow query history in all databases, not just
          the selected one.
          Using the parameter is only allowed in the system database and with superuser
          privileges.
        in: query
      responses:
        '200':
          description: |2+
            The server will respond with *HTTP 200* when the list of queries was
            cleared successfully.
      tags:
      - AQL
```



### Killing queries

Running AQL queries can also be killed on the server. ArangoDB provides a kill facility
via an HTTP interface. To kill a running query, its id (as returned for the query in the
list of currently running queries) must be specified. The kill flag of the query will
then be set, and the query will be aborted as soon as it reaches a cancelation point.

<!--arangod/RestHandler/RestQueryHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/query/{query-id}:
    delete:
      description: "\nKills a running query in the currently selected database. The\
        \ query will be \nterminated at the next cancelation point.\n\n"
      operationId: ' deleteQuery'
      parameters:
      - name: query-id
        schema:
          type: string
        required: true
        description: |+
          The id of the query.
        in: path
      - name: all
        schema:
          type: boolean
        required: false
        description: "If set to *true*, will attempt to kill the specified query in\
          \ all databases, \nnot just the selected one.\nUsing the parameter is only\
          \ allowed in the system database and with superuser\nprivileges.\n\n"
        in: query
      responses:
        '200':
          description: |2+
            The server will respond with *HTTP 200* when the query was still running when
            the kill request was executed and the query's kill flag was set.
        '400':
          description: |2+
            The server will respond with *HTTP 400* in case of a malformed request.
        '403':
          description: |2+
            *HTTP 403* is returned in case the *all* parameter was used, but the request
            was made in a different database than _system, or by an non-privileged user.
      tags:
      - AQL
```


