---
fileID: administration-and-monitoring
title: HTTP Interface for Administration and Monitoring
weight: 2275
description: 
layout: default
---
<!-- arangod/RestHandler/RestAdminServerHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/server/tls:
    get:
      description: |2+
        Return a summary of the TLS data. The JSON response will contain a field
        `result` with the following components:
          - `keyfile`: Information about the key file.
          - `clientCA`: Information about the CA for client certificate
            verification.
        If server name indication (SNI) is used and multiple key files are
        configured for different server names, then there is an additional
        attribute `SNI`, which contains for each configured server name
        the corresponding information about the key file for that server name.
        In all cases the value of the attribute will be a JSON object, which
        has a subset of the following attributes (whatever is appropriate):
          - `sha256`: The value is a string with the SHA256 of the whole input
            file.
          - `certificates`: The value is a JSON array with the public
            certificates in the chain in the file.
          - `privateKeySha256`: In cases where there is a private key (`keyfile`
            but not `clientCA`), this field is present and contains a
            JSON string with the SHA256 of the private key.
        This API requires authentication.
      operationId: ' handleMode:get'
      tags:
      - Administration
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/server/tls:
    post:
      description: |2+
        This API call triggers a reload of all the TLS data and then
        returns a summary. The JSON response is exactly as in the corresponding
        GET request (see there).
        This is a protected API and can only be executed with superuser rights.
      operationId: ' handleTLS:post'
      responses:
        '200':
          description: |2+
            This API will return HTTP 200 if everything is ok
      tags:
      - Administration
```



## Encryption at Rest

<!-- arangod/RestHandler/RestAdminServerHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/server/encryption:
    post:
      description: |2+
        Change the user supplied encryption at rest key by sending a request without
        payload to this endpoint. The file supplied via `--rocksdb.encryption-keyfolder`
        will be reloaded and the internal encryption key will be re-encrypted with the
        new user key.
        This is a protected API and can only be executed with superuser rights.
        This API is not available on coordinator nodes.
        The API returns HTTP 404 in case encryption key rotation is disabled.
      operationId: ' handleEncryption:post'
      responses:
        '200':
          description: |2+
            This API will return HTTP 200 if everything is ok
        '403':
          description: |2+
            This API will return HTTP 403 FORBIDDEN if it is not called with
            superuser rights.
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: object
                    schema:
                      $ref: '#/components/schemas/jwt_keys_struct'
                    description: |+
                      The result object.
                required:
                - result
      tags:
      - Administration
```



## Cluster

<!-- js/actions/api-system.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/server/mode:
    get:
      description: |2+
        Return mode information about a server. The json response will contain
        a field `mode` with the value `readonly` or `default`. In a read-only server
        all write operations will fail with an error code of `1004` (_ERROR_READ_ONLY_).
        Creating or dropping of databases and collections will also fail with error code `11` (_ERROR_FORBIDDEN_).
        This API requires authentication.
      operationId: ' handleMode:get'
      tags:
      - Administration
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/server/mode:
    put:
      description: |2+
        Update mode information about a server. The json response will contain
        a field `mode` with the value `readonly` or `default`. In a read-only server
        all write operations will fail with an error code of `1004` (_ERROR_READ_ONLY_).
        Creating or dropping of databases and collections will also fail with error
        code `11` (_ERROR_FORBIDDEN_).
        This is a protected API. It requires authentication and administrative
        server rights.
      operationId: ' handleMode:set'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                mode:
                  type: string
                  description: |+
                    The mode of the server `readonly` or `default`.
              required:
              - mode
      responses:
        '200':
          description: |2+
            This API will return HTTP 200 if everything is ok
      tags:
      - Administration
```


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


```http-spec
openapi: 3.0.2
paths:
  /_admin/server/availability:
    get:
      description: |2+
        Return availability information about a server.
        This is a public API so it does *not* require authentication. It is meant to be
        used only in the context of server monitoring.
      operationId: ' handleAvailability'
      responses:
        '200':
          description: |2+
            This API will return HTTP 200 in case the server is up and running and usable for
            arbitrary operations, is not set to read-only mode and is currently not a follower
            in case of an active failover setup.
      tags:
      - Administration
```



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
          description: |2+
            is returned when everything went well.
        '400':
          description: |2+
            the parameter DBserver was not given or is not the ID of a DB-Server
      tags:
      - Cluster
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/health:
    get:
      description: |2+
        Queries the health of the cluster for monitoring purposes. The response is a JSON object, containing the standard `code`, `error`, `errorNum`, and `errorMessage` fields as appropriate. The endpoint-specific fields are as follows:
        - `ClusterId`: A UUID string identifying the cluster
        - `Health`: An object containing a descriptive sub-object for each node in the cluster.
          - `<nodeID>`: Each entry in `Health` will be keyed by the node ID and contain the following attributes:
            - `Endpoint`: A string representing the network endpoint of the server.
            - `Role`: The role the server plays. Possible values are `"AGENT"`, `"COORDINATOR"`, and `"DBSERVER"`.
            - `CanBeDeleted`: Boolean representing whether the node can safely be removed from the cluster.
            - `Version`: Version String of ArangoDB used by that node.
            - `Engine`: Storage Engine used by that node.
            - `Status`: A string indicating the health of the node as assessed by the supervision (Agency). This should be considered primary source of truth for Coordinator and DB-Servers node health. If the node is responding normally to requests, it is `"GOOD"`. If it has missed one heartbeat, it is `"BAD"`. If it has been declared failed by the supervision, which occurs after missing heartbeats for about 15 seconds, it will be marked `"FAILED"`.
            Additionally it will also have the following attributes for:
            **Coordinators** and **DB-Servers**
            - `SyncStatus`: The last sync status reported by the node. This value is primarily used to determine the value of `Status`. Possible values include `"UNKNOWN"`, `"UNDEFINED"`, `"STARTUP"`, `"STOPPING"`, `"STOPPED"`, `"SERVING"`, `"SHUTDOWN"`.
            - `LastAckedTime`: ISO 8601 timestamp specifying the last heartbeat received.
            - `ShortName`: A string representing the shortname of the server, e.g. `"Coordinator0001"`.
            - `Timestamp`: ISO 8601 timestamp specifying the last heartbeat received. (deprecated)
            - `Host`: An optional string, specifying the host machine if known.
            **Coordinators** only
            - `AdvertisedEndpoint`: A string representing the advertised endpoint, if set. (e.g. external IP address or load balancer, optional)
            **Agents**
            - `Leader`: ID of the Agent this node regards as leader.
            - `Leading`: Whether this Agent is the leader (true) or not (false).
            - `LastAckedTime`: Time since last `acked` in seconds.
      tags:
      - Cluster
```



<!-- arangod/Cluster/AutoRebalance.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/rebalance:
    get:
      description: "\nComputes the current cluster imbalance and returns the result.\
        \ \nIt additionally shows the amount of ongoing and pending move shard operations.\n\
        \n"
      responses:
        '200':
          description: |2+
            This API returns HTTP 200.
          content:
            application/json:
              schema:
                type: object
                properties:
                  pendingMoveShards:
                    type: number
                    description: |+
                      The number of pending move shard operations.
                required:
                - pendingMoveShards
      tags:
      - Administration
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/rebalance:
    post:
      description: |2+
        Compute a set of move shard operations to improve balance.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                ? ''
                : type: object
                  schema:
                    $ref: '#/components/schemas/rebalance_compute'
                  description: |2+
              required:
              - ''
      responses:
        '200':
          description: |2+
            This API returns HTTP 200.
      tags:
      - Administration
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/rebalance/execute:
    post:
      description: |2+
        Execute the given set of move shard operations. You can use the
        `POST /_admin/cluster/rebalance` endpoint to calculate these operations to improve
        the balance of shards, leader shards, and follower shards.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                version:
                  type: number
                  description: |+
                    Must be set to `1`.
                moves:
                  type: array
                  schema:
                    $ref: '#/components/schemas/move_shard_operation'
                  description: |+
                    A set of move shard operations to execute.
              required:
              - version
              - moves
      responses:
        '200':
          description: |2+
            This API returns HTTP 200 if no operations are provided.
      tags:
      - Administration
```


```http-spec
openapi: 3.0.2
paths:
  /_admin/cluster/rebalance:
    put:
      description: |2+
        Compute a set of move shard operations to improve balance.
        These moves are then immediately executed.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                ? ''
                : type: object
                  schema:
                    $ref: '#/components/schemas/rebalance_compute'
                  description: |2+
              required:
              - ''
      responses:
        '200':
          description: |2+
            This API returns HTTP 200.
      tags:
      - Administration
```



## Other

<!-- arangod/RocksDBEngine/RocksDBRestHandlers.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/compact:
    put:
      description: |2+
        This endpoint can be used to reclaim disk space after substantial data
        deletions have taken place. It requires superuser access.
      operationId: ' RestCompactHandler'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                changeLevel:
                  type: boolean
                  description: |+
                    whether or not compacted data should be moved to the minimum possible level.
                    The default value is *false*.
                compactBottomMostLevel:
                  type: boolean
                  description: |+
                    Whether or not to compact the bottommost level of data.
                    The default value is *false*.
              required: []
      responses:
        '200':
          description: |2+
            Compaction started successfully
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
name: RestAdminCompact
release: stable
version: '3.10'
---
    var response = logCurlRequest('PUT', '/_admin/compact', '');
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-system.js -->
```http-spec
openapi: 3.0.2
paths:
  /_admin/routing/reload:
    post:
      description: |2+
        Reloads the routing information from the collection *routing*.
      operationId: ' RestAdminRoutingHandler'
      tags:
      - Administration
```


