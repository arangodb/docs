---
layout: default
description: >-
  The HTTP API for AQL queries lets you to execute, track, kill, explain, and
  validate queries written in ArangoDB's query language
redirect_from:
  - aql-query-cursor.html # 3.10 -> 3.10
  - aql-query-cursor-query-results.html # 3.10 -> 3.10
  - aql-query-cursor-accessing-cursors.html # 3.10 -> 3.10
---
# HTTP interfaces for AQL queries

{{ page.description }}
{:class="lead"}

## Cursors

Results of AQL queries are returned as cursors in order to batch the communication
between server and client. Each batch contains a number of documents and an
indication if the current batch is the final batch. Depending on the query, the
total number of documents in the result set may or may not be known in advance.

If the number of documents doesn't exceed the batch size, the full query result
is returned to the client in a single round-trip. If there are more documents,
then the first batch is returned to the client and the client needs to use the
cursor to retrieve the other batches.

In order to free up server resources, the client should delete a cursor as soon
as it is no longer needed.

### Single roundtrip

The server only transfers a certain number of result documents back to the
client in one roundtrip. This number is controllable by the client by setting
the `batchSize` attribute when issuing the query.

If the complete result can be transferred to the client in one go, the client
does not need to issue any further request. The client can check whether it has
retrieved the complete result set by checking the `hasMore` attribute of the
result set. If it is set to `false`, then the client has fetched the complete
result set from the server. In this case, no server-side cursor is created.

```js
> curl --data @- -X POST --dump - http://localhost:8529/_api/cursor
{ "query" : "FOR u IN users LIMIT 2 RETURN u", "count" : true, "batchSize" : 2 }

HTTP/1.1 201 Created
Content-type: application/json

{
  "hasMore" : false,
  "error" : false,
  "result" : [
    {
      "name" : "user1",
      "_rev" : "210304551",
      "_key" : "210304551",
      "_id" : "users/210304551"
    },
    {
      "name" : "user2",
      "_rev" : "210304552",
      "_key" : "210304552",
      "_id" : "users/210304552"
    }
  ],
  "code" : 201,
  "count" : 2
}
```

### Using a cursor

If the result set contains more documents than should be transferred in a single
roundtrip (i.e. as set via the `batchSize` attribute), the server returns
the first few documents and creates a temporary cursor. The cursor identifier
is also returned to the client. The server puts the cursor identifier
in the `id` attribute of the response object. Furthermore, the `hasMore`
attribute of the response object is set to `true`. This is an indication
for the client that there are additional results to fetch from the server.

**Examples**

Create and extract first batch:

```js
> curl --data @- -X POST --dump - http://localhost:8529/_api/cursor
{ "query" : "FOR u IN users LIMIT 5 RETURN u", "count" : true, "batchSize" : 2 }

HTTP/1.1 201 Created
Content-type: application/json

{
  "hasMore" : true,
  "error" : false,
  "id" : "26011191",
  "result" : [
    {
      "name" : "user1",
      "_rev" : "258801191",
      "_key" : "258801191",
      "_id" : "users/258801191"
    },
    {
      "name" : "user2",
      "_rev" : "258801192",
      "_key" : "258801192",
      "_id" : "users/258801192"
    }
  ],
  "code" : 201,
  "count" : 5
}
```

Extract next batch, still have more:

```js
> curl -X POST --dump - http://localhost:8529/_api/cursor/26011191

HTTP/1.1 200 OK
Content-type: application/json

{
  "hasMore" : true,
  "error" : false,
  "id" : "26011191",
  "result": [
    {
      "name" : "user3",
      "_rev" : "258801193",
      "_key" : "258801193",
      "_id" : "users/258801193"
    },
    {
      "name" : "user4",
      "_rev" : "258801194",
      "_key" : "258801194",
      "_id" : "users/258801194"
    }
  ],
  "code" : 200,
  "count" : 5
}
```

Extract next batch, done:

```js
> curl -X POST --dump - http://localhost:8529/_api/cursor/26011191

HTTP/1.1 200 OK
Content-type: application/json

{
  "hasMore" : false,
  "error" : false,
  "result" : [
    {
      "name" : "user5",
      "_rev" : "258801195",
      "_key" : "258801195",
      "_id" : "users/258801195"
    }
  ],
  "code" : 200,
  "count" : 5
}
```

Do not do this because `hasMore` now has a value of false:

```js
> curl -X POST --dump - http://localhost:8529/_api/cursor/26011191

HTTP/1.1 404 Not Found
Content-type: application/json

{
  "errorNum": 1600,
  "errorMessage": "cursor not found: disposed or unknown cursor",
  "error": true,
  "code": 404
}
```

If the `allowRetry` query option is set to `true`, then the response object
contains a `nextBatchId` attribute, except for the last batch (if `hasMore` is
`false`). If retrieving a result batch fails because of a connection issue, you
can ask for that batch again using the `POST /_api/cursor/<cursor-id>/<batch-id>`
endpoint. The first batch has an ID of `1` and the value is incremented by 1
with every batch. Every result response except the last one also includes a
`nextBatchId` attribute, indicating the ID of the batch after the current.
You can remember and use this batch ID should retrieving the next batch fail.

```js
> curl --data @- -X POST --dump - http://localhost:8529/_api/cursor
{ "query": "FOR i IN 1..5 RETURN i", "batchSize": 2, "options": { "allowRetry": true } }

HTTP/1.1 201 Created
Content-type: application/json

{
  "result":[1,2],
  "hasMore":true,
  "id":"3517",
  "nextBatchId":2,
  "cached":false,
  "error":false,
  "code":201
}
```

Fetching the second batch would look like this:

```js
> curl -X POST --dump - http://localhost:8529/_api/cursor/3517
```

Assuming the above request fails because of a connection issue but advances the
cursor nonetheless, you can retry fetching the batch using the `nextBatchId` of
the first request (`2`):

```js
curl -X POST --dump http://localhost:8529/_api/cursor/3517/2

{
  "result":[3,4],
  "hasMore":true,
  "id":"3517",
  "nextBatchId":3,
  "cached":false,
  "error":false,
  "code":200
}
```

To allow refetching of the last batch of the query, the server cannot
automatically delete the cursor. After the first attempt of fetching the last
batch, the server would normally delete the cursor to free up resources. As you
might need to reattempt the fetch, it needs to keep the final batch when the
`allowRetry` option is enabled. Once you successfully received the last batch,
you should call the `DELETE /_api/cursor/<cursor-id>` endpoint so that the
server doesn't unnecessary keep the batch until the cursor times out
(`ttl` query option).

```js
curl -X POST --dump http://localhost:8529/_api/cursor/3517/3

{
  "result":[5],
  "hasMore":false,
  "id":"3517",
  "cached":false,
  "error":false,
  "code":200
}

curl -X DELETE --dump http://localhost:8529/_api/cursor/3517

{
  "id":"3517",
  "error":false,
  "code":202
}
```

## Execute AQL queries

{% docublock post_api_cursor %}
{% docublock post_api_cursor_cursor %}
{% docublock put_api_cursor_cursor %}
{% docublock delete_api_cursor_cursor %}

## Track queries

You can track AQL queries by enabling query tracking. This allows you to list
all currently executing queries. You can also list slow queries and clear this
list.

{% docublock get_api_query_properties %}
{% docublock put_api_query_properties %}
{% docublock get_api_query_current %}
{% docublock get_api_query_slow %}
{% docublock delete_api_query_slow %}

## Kill queries

Running AQL queries can be killed on the server. To kill a running query, its ID
(as returned for the query in the list of currently running queries) must be
specified. The kill flag of the query is then set, and the query is aborted as
soon as it reaches a cancelation point.

{% docublock delete_api_query_query %}

## Explain and parse AQL queries

You can retrieve the execution plan for any valid AQL query, as well as
syntactically validate AQL queries. Both functionalities don't actually execute
the supplied AQL query, but only inspect it and return meta information about it.

You can also retrieve a list of all query optimizer rules and their properties.

{% docublock post_api_explain %}
{% docublock post_api_query %}
{% docublock get_api_query_rules %}
