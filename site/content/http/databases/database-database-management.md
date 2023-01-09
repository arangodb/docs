---
fileID: database-database-management
title: Database Management
weight: 1940
description: 
layout: default
---
This is an introduction to ArangoDB's HTTP interface for managing databases.

The HTTP interface for databases provides operations to create and drop
individual databases. These are mapped to the standard HTTP methods *POST*
and *DELETE*. There is also the *GET* method to retrieve an array of existing
databases.

Please note that all database management operations can only be accessed via
the default database (*_system*) and none of the other databases.

## Managing Databases using HTTP

<!-- js/actions/api-database.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/database/current:
    get:
      description: |2+
        Retrieves the properties of the current database
        The response is a JSON object with the following attributes:
        - *name*: the name of the current database
        - *id*: the id of the current database
        - *path*: the filesystem path of the current database
        - *isSystem*: whether or not the current database is the *_system* database
        - *sharding*: the default sharding method for collections created in this database
        - *replicationFactor*: the default replication factor for collections in this database
        - *writeConcern*: the default write concern for collections in this database
      operationId: ' getDatabases:current'
      responses:
        '200':
          description: |2
            is returned if the information was retrieved successfully.
        '400':
          description: |2
            is returned if the request is invalid.
        '404':
          description: |2
            is returned if the database could not be found.
      tags:
      - Database
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDatabaseGetInfo
release: stable
version: '3.10'
---
    var url = "/_api/database/current";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-database.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/database/user:
    get:
      description: |2+
        Retrieves the list of all databases the current user can access without
        specifying a different username or password.
      operationId: ' getDatabases:user'
      responses:
        '200':
          description: |2
            is returned if the list of database was compiled successfully.
        '400':
          description: |2
            is returned if the request is invalid.
      tags:
      - Database
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDatabaseGetUser
release: stable
version: '3.10'
---
    var url = "/_api/database/user";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-database.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/database:
    get:
      description: |2+
        Retrieves the list of all existing databases
        **Note**: retrieving the list of databases is only possible from within the *_system* database.
        **Note**: You should use the *GET user API* to fetch the list of the available databases now.
      operationId: ' getDatabases:all'
      responses:
        '200':
          description: |2
            is returned if the list of database was compiled successfully.
        '400':
          description: |2
            is returned if the request is invalid.
        '403':
          description: |2
            is returned if the request was not executed in the *_system* database.
      tags:
      - Database
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDatabaseGet
release: stable
version: '3.10'
---
    var url = "/_api/database";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-database.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/database:
    post:
      description: |2+
        Creates a new database
        The response is a JSON object with the attribute *result* set to *true*.
        **Note**: creating a new database is only possible from within the *_system* database.
      operationId: ' createDatabase'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    Has to contain a valid database name. The name must conform to the selected
                    naming convention for databases. If the name contains Unicode characters, the
                    name must be [NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
                    Non-normalized names will be rejected by arangod.
                options:
                  $ref: '#/components/schemas/get_api_database_new_OPTIONS'
                  description: |+
                    Optional object which can contain the following attributes:
                users:
                  $ref: '#/components/schemas/get_api_database_new_USERS'
                  items:
                    type: get_api_database_new_USERS
                  description: |+
                    An array of user objects. The users will be granted *Administrate* permissions
                    for the new database. Users that do not exist yet will be created.
                    If *users* is not specified or does not contain any users, the default user
                    *root* will be used to ensure that the new database will be accessible after it
                    is created. The *root* user is created with an empty password should it not
                    exist. Each user object can contain the following attributes:
              required:
              - name
      responses:
        '201':
          description: |2
            is returned if the database was created successfully.
        '400':
          description: |2
            is returned if the request parameters are invalid or if a database with the
            specified name already exists.
        '403':
          description: |2
            is returned if the request was not executed in the *_system* database.
        '409':
          description: |2
            is returned if a database with the specified name already exists.
      tags:
      - Database
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDatabaseCreate
release: stable
version: '3.10'
---
    var url = "/_api/database";
    var name = "example";
    try {
      db._dropDatabase(name);
    }
    catch (err) {
    }
    var data = {
      name: name,
      options: {
        sharding: "flexible",
        replicationFactor: 3
      }
    };
    var response = logCurlRequest('POST', url, data);
    db._dropDatabase(name);
    assert(response.code === 201);
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
name: RestDatabaseCreateUsers
release: stable
version: '3.10'
---
    var url = "/_api/database";
    var name = "mydb";
    try {
      db._dropDatabase(name);
    }
    catch (err) {
    }
    var data = {
      name: name,
      users: [
        {
          username: "admin",
          passwd: "secret",
          active: true
        },
        {
          username: "tester",
          passwd: "test001",
          active: false
        }
      ]
    };
    var response = logCurlRequest('POST', url, data);
    db._dropDatabase(name);
    assert(response.code === 201);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-database.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/database/{database-name}:
    delete:
      description: |2+
        Drops the database along with all data stored in it.
        **Note**: dropping a database is only possible from within the *_system* database.
        The *_system* database itself cannot be dropped.
      operationId: ' deleteDatabase'
      parameters:
      - name: database-name
        schema:
          type: string
        required: true
        description: |+
          The name of the database
        in: path
      responses:
        '200':
          description: |2
            is returned if the database was dropped successfully.
        '400':
          description: |2
            is returned if the request is malformed.
        '403':
          description: |2
            is returned if the request was not executed in the *_system* database.
        '404':
          description: |2
            is returned if the database could not be found.
      tags:
      - Database
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDatabaseDrop
release: stable
version: '3.10'
---
    var url = "/_api/database";
    var name = "example";
    db._createDatabase(name);
    var response = logCurlRequest('DELETE', url + '/' + name);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

