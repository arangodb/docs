---
fileID: user-management
title: HTTP Interface for User Management
weight: 2220
description: 
layout: default
---
This is an introduction to ArangoDB's HTTP interface for managing users.

The interface provides a simple means to add, update, and remove users.  All
users managed through this interface will be stored in the system collection
*_users*. You should never manipulate the *_users* collection directly.

This specialized interface intentionally does not provide all functionality that
is available in the regular document REST API.

Please note that user operations are not included in ArangoDB's replication.
```http-spec
openapi: 3.0.2
paths:
  /_api/user:
    post:
      description: |2+
        Create a new user. You need server access level *Administrate* in order to
        execute this REST call.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                user:
                  type: string
                  description: |+
                    The name of the user as a string. This is mandatory.
                passwd:
                  type: string
                  description: |+
                    The user password as a string. If not specified, it will default to an empty
                    string.
                active:
                  type: boolean
                  description: |+
                    An optional flag that specifies whether the user is active. If not
                    specified, this will default to *true*.
                extra:
                  type: object
                  description: |+
                    A JSON object with extra user information. It is used by the web interface
                    to store graph viewer settings and saved queries. Should not be set or
                    modified by end users, as custom attributes will not be preserved.
              required:
              - user
              - passwd
      responses:
        '201':
          description: |2
            Returned if the user can be added by the server
        '400':
          description: |2
            If the JSON representation is malformed or mandatory data is missing
            from the request.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
        '409':
          description: |2
            Returned if a user with the same name already exists.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCreateUser
release: stable
version: '3.10'
---
    ~try { require("@arangodb/users").remove("admin@example"); } catch (err) {}
    var url = "/_api/user";
    var data = { user: "admin@example", passwd: "secure" };
    var response = logCurlRequest('POST', url, data);
    assert(response.code === 201);
    logJsonResponse(response);
    ~require("@arangodb/users").remove("admin@example");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/{dbname}:
    put:
      description: |2+
        Sets the database access levels for the database *dbname* of user *user*. You
        need the *Administrate* server access level in order to execute this REST
        call.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                grant:
                  type: string
                  description: |+
                    - Use "rw" to set the database access level to *Administrate*.
                    - Use "ro" to set the database access level to *Access*.
                    - Use "none" to set the database access level to *No access*.
              required:
              - grant
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user.
        in: path
      - name: dbname
        schema:
          type: string
        required: true
        description: |+
          The name of the database.
        in: path
      responses:
        '200':
          description: |2
            Returned if the access level was changed successfully.
        '400':
          description: |2
            If the JSON representation is malformed or mandatory data is missing
            from the request.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestGrantDatabase
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser = "admin@myapp";
    users.save(theUser, "secret")
    var url = "/_api/user/" + theUser + "/database/_system";
    var data = { grant: "rw" };
    var response = logCurlRequest('PUT', url, data);
    assert(response.code === 200);
    logJsonResponse(response);
    users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/{dbname}/{collection}:
    put:
      description: |2+
        Sets the collection access level for the *collection* in the database *dbname*
        for user *user*. You need the *Administrate* server access level in order to
        execute this REST call.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                grant:
                  type: string
                  description: |+
                    Use "rw" to set the collection level access to *Read/Write*.
                    Use "ro" to set the collection level access to  *Read Only*.
                    Use "none" to set the collection level access to *No access*.
              required:
              - grant
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user.
        in: path
      - name: dbname
        schema:
          type: string
        required: true
        description: |+
          The name of the database.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      responses:
        '200':
          description: |2
            Returned if the access permissions were changed successfully.
        '400':
          description: |2
            If the JSON representation is malformed or mandatory data is missing
            from the request.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestGrantCollection
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser = "admin@myapp";
~   try { users.remove(theUser); } catch (err) {}
~   try { db_drop("reports"); } catch (err) {}
~   db._create("reports");
    users.save(theUser, "secret")
    var url = "/_api/user/" + theUser + "/database/_system/reports";
    var data = { grant: "rw" };
    var response = logCurlRequest('PUT', url, data);
    assert(response.code === 200);
~   db._drop("reports");
    logJsonResponse(response);
    users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/{dbname}:
    delete:
      description: |2+
        Clears the database access level for the database *dbname* of user *user*. As
        consequence the default database access level is used. If there is no defined
        default database access level, it defaults to *No access*. You need permission
        to the *_system* database in order to execute this REST call.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user.
        in: path
      - name: dbname
        schema:
          type: string
        required: true
        description: |+
          The name of the database.
        in: path
      responses:
        '202':
          description: |2
            Returned if the access permissions were changed successfully.
        '400':
          description: |2
            If the JSON representation is malformed or mandatory data is missing
            from the request.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestRevokeDatabase
release: stable
version: '3.10'
---
var users = require("@arangodb/users");
var theUser = "admin@myapp";
try { users.remove(theUser); } catch (err) {}
users.save(theUser, "secret")
var url = "/_api/user/" + theUser + "/database/_system";
var response = logCurlRequest('DELETE', url);
assert(response.code === 202);
logJsonResponse(response);
users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/{dbname}/{collection}:
    delete:
      description: |2+
        Clears the collection access level for the collection *collection* in the
        database *dbname* of user *user*.  As consequence the default collection
        access level is used. If there is no defined default collection access level,
        it defaults to *No access*.  You need permissions to the *_system* database in
        order to execute this REST call.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user.
        in: path
      - name: dbname
        schema:
          type: string
        required: true
        description: |+
          The name of the database.
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      responses:
        '202':
          description: |2
            Returned if the access permissions were changed successfully.
        '400':
          description: |2
            If there was an error
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestRevokeCollection
release: stable
version: '3.10'
---
  var users = require("@arangodb/users");
  var theUser = "admin@myapp";
  try { users.remove(theUser); } catch (err) {}
~ try { db_drop("reports"); } catch (err) {}
~ db._create("reports");
  users.save(theUser, "secret")
  users.grantCollection(theUser, "_system", "reports", "rw");
  var url = "/_api/user/" + theUser + "/database/_system/reports";
  var response = logCurlRequest('DELETE', url);
  assert(response.code === 202);
~ db._drop("reports");
  logJsonResponse(response);
  users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/:
    get:
      description: |2+
        Fetch the list of databases available to the specified *user*. You need
        *Administrate* for the server access level in order to execute this REST call.
        The call will return a JSON object with the per-database access
        privileges for the specified user. The *result* object will contain
        the databases names as object keys, and the associated privileges
        for the database as values.
        In case you specified *full*, the result will contain the permissions
        for the databases as well as the permissions for the collections.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user for which you want to query the databases.
        in: path
      - name: full
        schema:
          type: boolean
        required: false
        description: |+
          Return the full set of access levels for all databases and all collections.
        in: query
      responses:
        '200':
          description: |2
            Returned if the list of available databases can be returned.
        '400':
          description: |2
            If the access privileges are not right etc.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestFetchUserDatabaseList
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser="anotherAdmin@secapp";
    users.save(theUser, "secret");
    users.grantDatabase(theUser, "_system", "rw");
    var url = "/_api/user/" + theUser + "/database/";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    users.remove(theUser);
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
name: RestFetchUserDatabaseListFull
release: stable
version: '3.10'
---
var users = require("@arangodb/users");
var theUser="anotherAdmin@secapp";
users.save(theUser, "secret");
users.grantDatabase(theUser, "_system", "rw");
var url = "/_api/user/" + theUser + "/database?full=true";
var response = logCurlRequest('GET', url);
assert(response.code === 200);
logJsonResponse(response);
users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/{dbname}:
    get:
      description: |2+
        Fetch the database access level for a specific database
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user for which you want to query the databases.
        in: path
      - name: dbname
        schema:
          type: string
        required: true
        description: |+
          The name of the database to query
        in: path
      responses:
        '200':
          description: |2
            Returned if the access level can be returned
        '400':
          description: |2
            If the access privileges are not right etc.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestFetchUserDatabasePermission
release: stable
version: '3.10'
---
var users = require("@arangodb/users");
var theUser="anotherAdmin@secapp";
users.save(theUser, "secret");
users.grantDatabase(theUser, "_system", "rw");
var url = "/_api/user/" + theUser + "/database/_system";
var response = logCurlRequest('GET', url);
assert(response.code === 200);
logJsonResponse(response);
users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/{dbname}/{collection}:
    get:
      description: |2+
        Returns the collection access level for a specific collection
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user for which you want to query the databases.
        in: path
      - name: dbname
        schema:
          type: string
        required: true
        description: |+
          The name of the database to query
        in: path
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name of the collection
        in: path
      responses:
        '200':
          description: |2
            Returned if the access level can be returned
        '400':
          description: |2
            If the access privileges are not right etc.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestFetchUserCollectionPermission
release: stable
version: '3.10'
---
var users = require("@arangodb/users");
var theUser="anotherAdmin@secapp";
users.save(theUser, "secret");
users.grantDatabase(theUser, "_system", "rw");
var url = "/_api/user/" + theUser + "/database/_system/_users";
var response = logCurlRequest('GET', url);
assert(response.code === 200);
logJsonResponse(response);
users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}:
    put:
      description: |2+
        Replaces the data of an existing user. You need server access level
        *Administrate* in order to execute this REST call. Additionally, users can
        change their own data.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                passwd:
                  type: string
                  description: |+
                    The user password as a string. If not specified, it will default to an empty
                    string.
                active:
                  type: boolean
                  description: |+
                    An optional flag that specifies whether the user is active. If not
                    specified, this will default to *true*.
                extra:
                  type: object
                  description: |+
                    A JSON object with extra user information. It is used by the web interface
                    to store graph viewer settings and saved queries. Should not be set or
                    modified by end users, as custom attributes will not be preserved.
              required:
              - passwd
      responses:
        '200':
          description: |2
            Is returned if the user data can be replaced by the server.
        '400':
          description: |2
            The JSON representation is malformed or mandatory data is missing from the request
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
        '404':
          description: |2
            The specified user does not exist
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestReplaceUser
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser = "admin@myapp";
    users.save(theUser, "secret")
    var url = "/_api/user/" + theUser;
    var data = { passwd: "secure" };
    var response = logCurlRequest('PUT', url, data);
    assert(response.code === 200);
    logJsonResponse(response);
    users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}:
    patch:
      description: |2+
        Partially updates the data of an existing user. You need server access level
        *Administrate* in order to execute this REST call. Additionally, users can
        change their own data.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                passwd:
                  type: string
                  description: |+
                    The user password as a string.
                active:
                  type: boolean
                  description: |+
                    An optional flag that specifies whether the user is active.
                extra:
                  type: object
                  description: |+
                    A JSON object with extra user information. It is used by the web interface
                    to store graph viewer settings and saved queries. Should not be set or
                    modified by end users, as custom attributes will not be preserved.
              required:
              - passwd
      responses:
        '200':
          description: |2
            Is returned if the user data can be replaced by the server.
        '400':
          description: |2
            The JSON representation is malformed or mandatory data is missing from the request.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
        '404':
          description: |2
            The specified user does not exist
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestUpdateUser
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser = "admin@myapp";
    users.save(theUser, "secret")
    var url = "/_api/user/" + theUser;
    var data = { passwd: "secure" };
    var response = logCurlRequest('PATCH', url, data);
    assert(response.code === 200);
    logJsonResponse(response);
    users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}:
    delete:
      description: |2+
        Removes an existing user, identified by *user*.  You need *Administrate* for
        the server access level in order to execute this REST call.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user
        in: path
      responses:
        '202':
          description: |2
            Is returned if the user was removed by the server
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
        '404':
          description: |2
            The specified user does not exist
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestDeleteUser
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser = "userToDelete@myapp";
    users.save(theUser, "secret")
    var url = "/_api/user/" + theUser;
    var response = logCurlRequest('DELETE', url, {});
    assert(response.code === 202);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/{user}/database/:
    get:
      description: |2+
        Fetch the list of databases available to the specified *user*. You need
        *Administrate* for the server access level in order to execute this REST call.
        The call will return a JSON object with the per-database access
        privileges for the specified user. The *result* object will contain
        the databases names as object keys, and the associated privileges
        for the database as values.
        In case you specified *full*, the result will contain the permissions
        for the databases as well as the permissions for the collections.
      parameters:
      - name: user
        schema:
          type: string
        required: true
        description: |+
          The name of the user for which you want to query the databases.
        in: path
      - name: full
        schema:
          type: boolean
        required: false
        description: |+
          Return the full set of access levels for all databases and all collections.
        in: query
      responses:
        '200':
          description: |2
            Returned if the list of available databases can be returned.
        '400':
          description: |2
            If the access privileges are not right etc.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestFetchUserDatabaseList
release: stable
version: '3.10'
---
    var users = require("@arangodb/users");
    var theUser="anotherAdmin@secapp";
    users.save(theUser, "secret");
    users.grantDatabase(theUser, "_system", "rw");
    var url = "/_api/user/" + theUser + "/database/";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    users.remove(theUser);
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
name: RestFetchUserDatabaseListFull
release: stable
version: '3.10'
---
var users = require("@arangodb/users");
var theUser="anotherAdmin@secapp";
users.save(theUser, "secret");
users.grantDatabase(theUser, "_system", "rw");
var url = "/_api/user/" + theUser + "/database?full=true";
var response = logCurlRequest('GET', url);
assert(response.code === 200);
logJsonResponse(response);
users.remove(theUser);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/user/:
    get:
      description: |2+
        Fetches data about all users.  You need the *Administrate* server access level
        in order to execute this REST call.  Otherwise, you will only get information
        about yourself.
        The call will return a JSON object with at least the following
        attributes on success:
        - *user*: The name of the user as a string.
        - *active*: An optional flag that specifies whether the user is active.
        - *extra*: A JSON object with extra user information. It is used by the web
          interface to store graph viewer settings and saved queries.
      responses:
        '200':
          description: |2
            The users that were found.
        '401':
          description: |2
            Returned if you have *No access* database access level to the *_system*
            database.
        '403':
          description: |2
            Returned if you have *No access* server access level.
      tags:
      - User Management
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestFetchAllUser
release: stable
version: '3.10'
---
    var url = "/_api/user";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

