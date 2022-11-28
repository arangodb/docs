---
fileID: cluster-statistics
title: 
weight: 2525
description: 
layout: default
---
<!-- js/actions/api-cluster.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/statistics:
    get:
      description: |2+
        Queries the statistics of the given DB-Server
      parameters:
      - name: DBserver
        schema:
          type: string
        required: true
        description: |2+
        in: query
      responses:
        '200':
          description: " \nis returned when everything went well.\n\n"
        '400':
          description: " \nthe parameter DBserver was not given or is not the ID of\
            \ a DB-Server\n\n"
      tags:
      - Cluster
```


