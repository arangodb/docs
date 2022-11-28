---
fileID: replications-other-replication
title: Other Replication Commands
weight: 2445
description: 
layout: default
---
<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/server-id:
    get:
      description: |2+
        Returns the servers id. The id is also returned by other replication API
        methods, and this method is an easy means of determining a server's id.
        The body of the response is a JSON object with the attribute *serverId*. The
        server id is returned as a string.
      operationId: ' handleCommandServerId'
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
      tags:
      - Replication
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestReplicationServerId
release: stable
version: '3.10'
---
    var url = "/_api/replication/server-id";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

