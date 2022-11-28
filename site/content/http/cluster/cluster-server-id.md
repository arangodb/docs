---
fileID: cluster-server-id
title: 
weight: 2515
description: 
layout: default
---
<!-- js/actions/api-system.js -->
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

