---
fileID: cluster-server-role
title: 
weight: 2520
description: 
layout: default
---
<!-- js/actions/api-system.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/server/role:
    get:
      description: |2+
        Returns the role of a server in a cluster.
        The role is returned in the *role* attribute of the result.
        Possible return values for *role* are:
        - *SINGLE*: the server is a standalone server without clustering
        - *COORDINATOR*: the server is a Coordinator in a cluster
        - *PRIMARY*: the server is a DB-Server in a cluster
        - *SECONDARY*: this role is not used anymore
        - *AGENT*: the server is an Agency node in a cluster
        - *UNDEFINED*: in a cluster, *UNDEFINED* is returned if the server role cannot be
           determined.
      operationId: ' handleRole'
      responses:
        '200':
          description: |2+
            Is returned in all cases.
          content:
            application/json:
              schema:
                type: object
                properties:
                  errorNum:
                    type: integer
                    schema:
                      $ref: '#/components/schemas/int64'
                    description: |+
                      the server error number
                required:
                - errorNum
      tags:
      - Administration
```

