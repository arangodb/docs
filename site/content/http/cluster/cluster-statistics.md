---
fileID: cluster-statistics
title: HTTP interface for cluster statistics
weight: 2345
description: 
layout: default
---
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
          description: |2+
            is returned when everything went well.
        '400':
          description: |2+
            the parameter DBserver was not given or is not the ID of a DB-Server
      tags:
      - Cluster
```


