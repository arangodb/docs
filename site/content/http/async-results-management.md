---
fileID: async-results-management
title: HTTP Interface for Async Results Management
weight: 2055
description: 
layout: default
---
## Request Execution

ArangoDB provides various methods of executing client requests. Clients can choose the appropriate method on a per-request level based on their throughput, control flow, and durability requirements.

### Blocking execution

ArangoDB is a multi-threaded server, allowing the processing of multiple client 
requests at the same time. Communication handling and the actual work can be performed
by multiple worker threads in parallel.

Though multiple clients can connect and send their requests in parallel to ArangoDB,
clients may need to wait for their requests to be processed.

By default, the server will fully process an incoming request and then return the
result to the client. The client must wait for the server's response before it can
send additional requests over the connection. For clients that are single-threaded
or not event-driven, waiting for the full server response may be non-optimal.

Furthermore, please note that even if the client closes the HTTP
connection, the request running on the server will still continue until
it is complete and only then notice that the client no longer listens.
Thus closing the connection does not help to abort a long running query!
See below under [Async Execution and later Result Retrieval](#async-execution-and-later-result-retrieval)
and [HttpJobPutCancel](#managing-async-results-via-http) for details.

### Fire and Forget

To mitigate client blocking issues, offers a generic mechanism 
for non-blocking requests: if clients add the HTTP header *x-arango-async: true* to their
requests, ArangoDB will put the request into an in-memory task queue and return an HTTP 202
(accepted) response to the client instantly. The server will execute the tasks from
the queue asynchronously, decoupling the client requests and the actual work.

This allows for much higher throughput than if clients would wait for the server's
response. The downside is that the response that is sent to the client is always the
same (a generic HTTP 202) and clients cannot make a decision based on the actual
operation's result at this point. In fact, the operation might have not even been executed at the
time the generic response has reached the client. Clients can thus not rely on their
requests having been processed successfully.

The asynchronous task queue on the server is not persisted, meaning not-yet processed
tasks from the queue will be lost in case of a crash. However, the client will
not know whether they were processed or not.

Clients should thus not send the extra header when they have strict durability 
requirements or if they rely on result of the sent operation for further actions.

The maximum number of queued tasks is determined by the startup option 
*--server.maximal-queue-size*. If more than this number of tasks are already queued,
the server will reject the request with an HTTP 500 error.

Finally, please note that it is not possible to cancel such a
fire and forget job, since you won't get any handle to identify it later on.
If you need to cancel requests,
use [Async Execution and later Result Retrieval](#async-execution-and-later-result-retrieval) 
and [HttpJobPutCancel](#managing-async-results-via-http) below.

### Async Execution and later Result Retrieval

By adding the HTTP header *x-arango-async: store* to a request, clients can instruct
the ArangoDB server to execute the operation asynchronously as [above](#fire-and-forget),
but also store the operation result in memory for a later retrieval. The
server will return a job id in the HTTP response header *x-arango-async-id*. The client
can use this id in conjunction with the HTTP API at */_api/job*, which is described in
detail in this manual.

Clients can ask the ArangoDB server via the async jobs API which results are
ready for retrieval, and which are not. Clients can also use the async jobs API to
retrieve the original results of an already executed async job by passing it the
originally returned job id. The server will then return the job result as if the job was 
executed normally. Furthermore, clients can cancel running async jobs by
their job id, see [HttpJobPutCancel](#managing-async-results-via-http).

ArangoDB will keep all results of jobs initiated with the *x-arango-async: store* 
header. Results are removed from the server only if a client explicitly asks the
server for a specific result.

The async jobs API also provides methods for garbage collection that clients can
use to get rid of "old" not fetched results. Clients should call this method periodically
because ArangoDB does not artificially limit the number of not-yet-fetched results.

It is thus a client responsibility to store only as many results as needed and to fetch 
available results as soon as possible, or at least to clean up not fetched results
from time to time.

The job queue and the results are kept in memory only on the server, so they will be
lost in case of a crash.

### Canceling asynchronous jobs

As mentioned above it is possible to cancel an asynchronously running
job using its job ID. This is done with a PUT request as described in
[HttpJobPutCancel](#managing-async-results-via-http). 

However, a few words of explanation about what happens behind the
scenes are in order. Firstly, a running async query can internally be
executed by C++ code or by JavaScript code. For example CRUD operations
are executed directly in C++, whereas AQL queries and transactions
are executed by JavaScript code. The job cancelation only works for
JavaScript code, since the mechanism used is simply to trigger an
uncatchable exception in the JavaScript thread, which will be caught
on the C++ level, which in turn leads to the cancelation of the job.
No result can be retrieved later, since all data about the request is
discarded.

If you cancel a job running on a Coordinator of a cluster (Sharding),
then only the code running on the Coordinator is stopped, there may
remain tasks within the cluster which have already been distributed to
the DB-Servers and it is currently not possible to cancel them as well.

### Async Execution and Authentication

If a request requires authentication, the authentication procedure is run before 
queueing. The request will only be queued if it valid credentials and the authentication 
succeeds. If the request does not contain valid credentials, it will not be queued but
rejected instantly in the same way as a "regular", non-queued request.

## Managing Async Results via HTTP

```http-spec
openapi: 3.0.2
paths:
  /_api/job/{job-id}:
    put:
      description: |2+
        Returns the result of an async job identified by job-id. If the async job
        result is present on the server, the result will be removed from the list of
        result. That means this method can be called for each job-id once.
        The method will return the original job result's headers and body, plus the
        additional HTTP header x-arango-async-job-id. If this header is present,
        then
        the job was found and the response contains the original job's result. If
        the header is not present, the job was not found and the response contains
        status information from the job manager.
      operationId: ' getJobResult'
      parameters:
      - name: job-id
        schema:
          type: string
        required: true
        description: |+
          The async job id.
        in: path
      responses:
        '204':
          description: |2
            is returned if the job requested via job-id is still in the queue of pending
            (or not yet finished) jobs. In this case, no x-arango-async-id HTTP header
            will be returned.
        '400':
          description: |2
            is returned if no job-id was specified in the request. In this case,
            no x-arango-async-id HTTP header will be returned.
        '404':
          description: |2
            is returned if the job was not found or already deleted or fetched from
            the job result list. In this case, no x-arango-async-id HTTP header will
            be returned.
      tags:
      - job
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: job_fetch_result_01
release: stable
version: '3.10'
---
  var url = "/_api/job";
  var response = logCurlRequest('PUT', url, "");
  assert(response.code === 400);
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
name: job_fetch_result_02
release: stable
version: '3.10'
---
  var url = "/_api/job/notthere";
  var response = logCurlRequest('PUT', url, "");
  assert(response.code === 404);
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
name: job_fetch_result_03
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/' + queryId
  var response = logCurlRequest('PUT', url, "");
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
name: job_fetch_result_04
release: stable
version: '3.10'
---
  var url = "/_api/collection";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, {"name":" this name is invalid "}, headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/' + queryId
  var response = logCurlRequest('PUT', url, "");
  assert(response.code === 400);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/job/{job-id}/cancel:
    put:
      description: |2+
        Cancels the currently running job identified by job-id. Note that it still
        might take some time to actually cancel the running async job.
      operationId: ' putJobMethod:cancel'
      parameters:
      - name: job-id
        schema:
          type: string
        required: true
        description: |+
          The async job id.
        in: path
      responses:
        '200':
          description: |2
            cancel has been initiated.
        '400':
          description: |2
            is returned if no job-id was specified in the request. In this case,
            no x-arango-async-id HTTP header will be returned.
        '404':
          description: |2
            is returned if the job was not found or already deleted or fetched from
            the job result list. In this case, no x-arango-async-id HTTP header will
            be returned.
      tags:
      - job
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: job_cancel
release: stable
version: '3.10'
---
  var url = "/_api/cursor";
  var headers = {'x-arango-async' : 'store'};
  var postData = {"query":
     "FOR i IN 1..10 FOR j IN 1..10 LET x = sleep(1.0) FILTER i == 5 && j == 5 RETURN 42"}
  var response = logCurlRequest('POST', url, postData, headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/pending';
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
  url = '/_api/job/' + queryId + '/cancel'
  var response = logCurlRequest('PUT', url, "");
  assert(response.code === 200);
  logJsonResponse(response);
  url = '/_api/job/pending';
  var response = logCurlRequest('GET', url, "");
  assert(response.code === 200);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/job/{type}#by-type:
    delete:
      description: |2+
        Deletes either all job results, expired job results, or the result of a
        specific job.
        Clients can use this method to perform an eventual garbage collection of job
        results.
      operationId: ' deleteJob:byType'
      parameters:
      - name: type
        schema:
          type: string
        required: true
        description: |+
          The type of jobs to delete. type can be
          * *all* Deletes all jobs results. Currently executing or queued async
            jobs will not be stopped by this call.
          * *expired* Deletes expired results. To determine the expiration status of a
            result, pass the stamp query parameter. stamp needs to be a UNIX timestamp,
            and all async job results created at a lower timestamp will be deleted.
          * *an actual job-id* In this case, the call will remove the result of the
            specified async job. If the job is currently executing or queued, it will
            not be aborted.
        in: path
      - name: stamp
        schema:
          type: number
        required: false
        description: |+
          A UNIX timestamp specifying the expiration threshold when type is expired.
        in: query
      responses:
        '200':
          description: |2
            is returned if the deletion operation was carried out successfully.
            This code will also be returned if no results were deleted.
        '400':
          description: |2
            is returned if type is not specified or has an invalid value.
        '404':
          description: |2
            is returned if type is a job-id but no async job with the specified id was
            found.
      tags:
      - job
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: job_delete_01
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  url = '/_api/job/all'
  var response = logCurlRequest('DELETE', url, "");
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
name: job_delete_02
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  var response = logCurlRequest('GET', "/_admin/time");
  assert(response.code === 200);
  logJsonResponse(response);
  now = JSON.parse(response.body).time;
  url = '/_api/job/expired?stamp=' + now
  var response = logCurlRequest('DELETE', url, "");
  assert(response.code === 200);
  logJsonResponse(response);
  url = '/_api/job/pending';
  var response = logCurlRequest('GET', url);
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
name: job_delete_03
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/' + queryId
  var response = logCurlRequest('DELETE', url, "");
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
name: job_delete_04
release: stable
version: '3.10'
---
  url = '/_api/job/AreYouThere'
  var response = logCurlRequest('DELETE', url, "");
  assert(response.code === 404);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/job/{job-id}:
    get:
      description: |2+
        Returns the processing status of the specified job. The processing status
        can be
        determined by peeking into the HTTP response code of the response.
      operationId: ' getJobById'
      parameters:
      - name: job-id
        schema:
          type: string
        required: true
        description: |+
          The async job id.
        in: path
      responses:
        '200':
          description: |2
            is returned if the job requested via job-id has been executed
            and its result is ready to fetch.
        '204':
          description: |2
            is returned if the job requested via job-id is still in the queue of pending
            (or not yet finished) jobs.
        '404':
          description: |2
            is returned if the job was not found or already deleted or fetched from the
            job result list.
      tags:
      - job
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: job_getStatusById_01
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/' + queryId
  var response = logCurlRequest('PUT', url, "");
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
render: input
name: job_getStatusById_02
release: stable
version: '3.10'
---
  var url = "/_api/transaction";
  var body = {
    collections: {
      read : [ "_aqlfunctions" ]
    },
    action: "function () {require('internal').sleep(15.0);}"
  };
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('POST', url, body, headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/' + queryId
  var response = logCurlRequest('GET', url);
  assert(response.code === 204);
  logRawResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/job/{type}#by-type:
    get:
      description: |2+
        Returns the list of ids of async jobs with a specific status (either done or
        pending).
        The list can be used by the client to get an overview of the job system
        status and
        to retrieve completed job results later.
      operationId: ' getJob'
      parameters:
      - name: type
        schema:
          type: string
        required: true
        description: |+
          The type of jobs to return. The type can be either done or pending. Setting
          the type to done will make the method return the ids of already completed
          async
          jobs for which results can be fetched. Setting the type to pending will
          return
          the ids of not yet finished async jobs.
        in: path
      - name: count
        schema:
          type: number
        required: false
        description: |2+
          The maximum number of ids to return per call. If not specified, a
          server-defined maximum value will be used.
        in: query
      responses:
        '200':
          description: |2
            is returned if the list can be compiled successfully. Note the list might
            be empty.
        '400':
          description: |2
            is returned if type is not specified or has an invalid value.
      tags:
      - job
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: job_getByType_01
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  url = '/_api/job/done'
  var response = logCurlRequest('GET', url, "");
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
name: job_getByType_02
release: stable
version: '3.10'
---
  var url = "/_api/version";
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('PUT', url, "", headers);
  assert(response.code === 202);
  logRawResponse(response);
  url = '/_api/job/pending'
  var response = logCurlRequest('GET', url, "");
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
name: job_getByType_03
release: stable
version: '3.10'
---
  var url = "/_api/transaction";
  var body = {
    collections: {
      read : [ "_frontend" ]
    },
    action: "function () {require('internal').sleep(15.0);}"
  };
  var headers = {'x-arango-async' : 'store'};
  var response = logCurlRequest('POST', url, body, headers);
  assert(response.code === 202);
  logRawResponse(response);
  var queryId = response.headers['x-arango-async-id'];
  url = '/_api/job/pending'
  var response = logCurlRequest('GET', url);
  assert(response.code === 200);
  logJsonResponse(response);
  url = '/_api/job/' + queryId
  var response = logCurlRequest('DELETE', url, "");
  assert(response.code === 200);
  logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


