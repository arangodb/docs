---
fileID: tasks
title: HTTP tasks Interface
weight: 2505
description: 
layout: default
---
Following you have ArangoDB's HTTP Interface for Tasks.

There are also some examples provided for every API action. 
```http-spec
openapi: 3.0.2
paths:
  /_api/tasks/:
    get:
      description: |2+
        fetches all existing tasks on the server
      operationId: ' getTasks'
      responses:
        '200':
          description: |2+
            The list of tasks
      tags:
      - Administration
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTasksListAll
release: stable
version: '3.10'
---
    var url = "/_api/tasks";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/tasks/{id}:
    get:
      description: |2+
        fetches one existing task on the server specified by *id*
      operationId: ' getTask'
      parameters:
      - name: id
        schema:
          type: string
        required: true
        description: |+
          The id of the task to fetch.
        in: path
      responses:
        '200':
          description: |2+
            The requested task
      tags:
      - Administration
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTasksListOne
release: stable
version: '3.10'
---
    var url = "/_api/tasks";
    var response = logCurlRequest('POST', url, JSON.stringify({ id: "testTask", command: "console.log('Hello from task!');", offset: 10000 }));
    var response = logCurlRequest('GET', url + "/testTask");
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
name: RestTasksListNonExisting
release: stable
version: '3.10'
---
    var url = "/_api/tasks/non-existing-task";
    var response = logCurlRequest('GET', url);
    assert(response.code === 404);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/tasks:
    post:
      description: |2+
        creates a new task with a generated id
      operationId: ' registerTask'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    The name of the task
                command:
                  type: string
                  description: |+
                    The JavaScript code to be executed
                params:
                  type: string
                  description: |+
                    The parameters to be passed into command
                period:
                  type: integer
                  description: |+
                    number of seconds between the executions
                offset:
                  type: integer
                  description: |+
                    Number of seconds initial delay
              required:
              - name
              - command
              - params
      responses:
        '200':
          description: |2+
            The task was registered
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: boolean
                    description: |+
                      *false* in this case
                required:
                - error
      tags:
      - Administration
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTasksCreate
release: stable
version: '3.10'
---
    var url = "/_api/tasks/";
    // Note: prints stuff if server is running in non-daemon mode.
    var sampleTask = {
      name: "SampleTask",
      command: "(function(params) { require('@arangodb').print(params); })(params)",
      params: { "foo": "bar", "bar": "foo"},
      period: 2
    }
    var response = logCurlRequest('POST', url,
                                  sampleTask);
    assert(response.code === 200);
    logJsonResponse(response);
    // Cleanup:
    logCurlRequest('DELETE', url + JSON.parse(response.body).id);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/tasks/{id}:
    put:
      description: |2+
        registers a new task with the specified id
      operationId: ' registerTask:byId'
      parameters:
      - name: id
        schema:
          type: string
        required: true
        description: |+
          The id of the task to create
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    The name of the task
                command:
                  type: string
                  description: |+
                    The JavaScript code to be executed
                params:
                  type: string
                  description: |+
                    The parameters to be passed into command
                period:
                  type: integer
                  description: |+
                    number of seconds between the executions
                offset:
                  type: integer
                  description: |+
                    Number of seconds initial delay
              required:
              - name
              - command
              - params
      tags:
      - Administration
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTasksPutWithId
release: stable
version: '3.10'
---
    var url = "/_api/tasks/";
    // Note: prints stuff if server is running in non-daemon mode.
    var sampleTask = {
      id: "SampleTask",
      name: "SampleTask",
      command: "(function(params) { require('@arangodb').print(params); })(params)",
      params: { "foo": "bar", "bar": "foo"},
      period: 2
    }
    var response = logCurlRequest('PUT', url + 'sampleTask',
                                  sampleTask);
    assert(response.code === 200);
    logJsonResponse(response);
    // Cleanup:
    curlRequest('DELETE', url + 'sampleTask');
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/tasks/{id}:
    delete:
      description: |2+
        Deletes the task identified by *id* on the server.
      operationId: ' deleteTask'
      parameters:
      - name: id
        schema:
          type: string
        required: true
        description: |+
          The id of the task to delete.
        in: path
      responses:
        '200':
          description: |2+
            If the task was deleted, *HTTP 200* is returned.
        '404':
          description: |2+
            If the task *id* is unknown, then an *HTTP 404* is returned.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: boolean
                    description: |+
                      *true* in this case
                required:
                - error
      tags:
      - Administration
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestTasksDeleteFail
release: stable
version: '3.10'
---
    var url = "/_api/tasks/NoTaskWithThatName";
    var response = logCurlRequest('DELETE', url);
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
name: RestTasksDelete
release: stable
version: '3.10'
---
    var url = "/_api/tasks/";
    var sampleTask = {
      id: "SampleTask",
      name: "SampleTask",
      command: "2+2;",
      period: 2
    }
    // Ensure it's really not there:
    curlRequest('DELETE', url + sampleTask.id, null, null, [404,200]);
    // put in something we may delete:
    curlRequest('PUT', url + sampleTask.id,
                sampleTask);
    var response = logCurlRequest('DELETE', url + sampleTask.id);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

