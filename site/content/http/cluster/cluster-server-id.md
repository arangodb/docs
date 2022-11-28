---
fileID: cluster-server-id
title: HTTP interface for server IDs
weight: 2335
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_admin/server/id:
    get:
      description: |2+
        Returns the id of a server in a cluster. The request will fail if the
        server is not running in cluster mode.
      operationId: ' handleId'
      responses:
        '200':
          description: |2+
            Is returned when the server is running in cluster mode.
      tags:
      - Administration
```


