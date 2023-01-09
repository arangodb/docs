---
fileID: cluster-maintenance
title: HTTP interface for cluster maintenance
weight: 2265
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/maintenance:
    put:
      description: "\nThis API allows to temporarily enable the supervision maintenance\
        \ mode. Please be aware that no\nautomatic failovers of any kind will take\
        \ place while the maintenance mode is enabled.\nThe cluster supervision reactivates\
        \ itself automatically at some point after disabling it.\n\nTo enable the\
        \ maintenance mode the request body must contain the string `\"on\"`\n(Please\
        \ note it _must_ be lowercase as well as include the quotes). This will enable\
        \ the\nmaintenance mode for 60 minutes, i.e. the supervision maintenance will\
        \ reactivate itself\nafter 60 minutes.\n\nSince ArangoDB 3.8.3 it is possible\
        \ to enable the maintenance mode for a different \nduration than 60 minutes,\
        \ it is possible to send the desired duration value (in seconds) \nas a string\
        \ in the request body. For example, sending `\"7200\"`\n(including the quotes)\
        \ will enable the maintenance mode for 7200 seconds, i.e. 2 hours.\n\nTo disable\
        \ the maintenance mode the request body must contain the string `\"off\"`\
        \ \n(Please note it _must_ be lowercase as well as include the quotes).\n\n"
      responses:
        '200':
          description: |2
            is returned when everything went well.
        '400':
          description: |2
            if the request contained an invalid body
        '501':
          description: |2
            if the request was sent to a node other than a Coordinator or single-server
        '504':
          description: |2
            if the request timed out while enabling the maintenance mode
      tags:
      - Cluster
```



```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/maintenance/{DB-Server-ID}:
    get:
      description: |2+
        Check whether the specified DB-Server is in maintenance mode and until when.
      parameters:
      - name: DB-Server-ID
        schema:
          type: string
        required: true
        description: |+
          The ID of a DB-Server.
        in: path
      responses:
        '200':
          description: |2
            The request was successful.
        '400':
          description: |2
            if the request contained an invalid body
        '412':
          description: |2
            if the request was sent to an Agent node
        '504':
          description: |2
            if the request timed out while enabling the maintenance mode
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: boolean
                    description: |+
                      Whether an error occurred. `false` in this case.
                  code:
                    type: integer
                    description: |+
                      The status code. `200` in this case.
                  result:
                    $ref: '#/components/schemas/get_cluster_maintenance_dbserver_result'
                    description: |+
                      The result object with the status. This attribute is omitted if the DB-Server
                      is in normal mode.
                required:
                - error
                - code
      tags:
      - Cluster
```



```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/maintenance/{DB-Server-ID}:
    put:
      description: |2+
        For rolling upgrades or rolling restarts, DB-Servers can be put into
        maintenance mode, so that no attempts are made to re-distribute the data in a
        cluster for such planned events. DB-Servers in maintenance mode are not
        considered viable failover targets because they are likely restarted soon.
      parameters:
      - name: DB-Server-ID
        schema:
          type: string
        required: true
        description: |+
          The ID of a DB-Server.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                mode:
                  type: string
                  description: |+
                    The mode to put the DB-Server in. Possible values:
                    - `"maintenance"`
                    - `"normal"`
                timeout:
                  type: integer
                  description: |+
                    After how many seconds the maintenance mode shall automatically end.
                    You can send another request when the DB-Server is already in maintenance mode
                    to extend the timeout.
              required:
              - mode
      responses:
        '200':
          description: |2
            The request was successful.
        '400':
          description: |2
            if the request contained an invalid body
        '412':
          description: |2
            if the request was sent to an Agency node
        '504':
          description: |2
            if the request timed out while enabling the maintenance mode
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: boolean
                    description: |+
                      Whether an error occurred. `false` in this case.
                  code:
                    type: integer
                    description: |+
                      The status code. `200` in this case.
                required:
                - error
                - code
      tags:
      - Cluster
```


