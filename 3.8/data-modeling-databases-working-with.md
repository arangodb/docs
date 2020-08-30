---
layout: default
description: The following methods are available to manage databases via JavaScript
---
Working with Databases
======================

Database Methods
----------------

The following methods are available to manage databases via JavaScript.
Please note that several of these methods can be used from the _system
database only.

### Name

<!-- arangod/V8Server/v8-vocbase.cpp -->

return the database name
`db._name()`

Returns the name of the current database as a string.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
@startDocuBlockInline dbName
@EXAMPLE_ARANGOSH_OUTPUT{dbName}
  require("@arangodb").db._name();
@END_EXAMPLE_ARANGOSH_OUTPUT
@endDocuBlock dbName
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### ID

<!-- arangod/V8Server/v8-vocbase.cpp -->

return the database id
`db._id()`

Returns the id of the current database as a string.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
@startDocuBlockInline dbId
@EXAMPLE_ARANGOSH_OUTPUT{dbId}
  require("@arangodb").db._id();
@END_EXAMPLE_ARANGOSH_OUTPUT
@endDocuBlock dbId
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Path

<!-- arangod/V8Server/v8-vocbase.cpp -->

return the path to database files
`db._path()`

Returns the filesystem path of the current database as a string.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
@startDocuBlockInline dbPath
@EXAMPLE_ARANGOSH_OUTPUT{dbPath}
  require("@arangodb").db._path();
@END_EXAMPLE_ARANGOSH_OUTPUT
@endDocuBlock dbPath
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### isSystem

<!-- arangod/V8Server/v8-vocbase.cpp -->

return the database type
`db._isSystem()`

Returns whether the currently used database is the *_system* database.
The system database has some special privileges and properties, for example,
database management operations such as create or drop can only be executed
from within this database. Additionally, the *_system* database itself
cannot be dropped.

### Properties

<!-- arangod/V8Server/v8-vocbase.cpp -->

return the path to database files
`db._properties()`

Returns the properties of the current database as an object with the following
attributes:

- *id*: the database id
- *name*: the database name
- *isSystem*: the database type
- *path*: the path to database files
- *sharding*: the sharding method to use for new collections *(Cluster only)*
- *replicationFactor*: default replication factor for new collections
  *(Cluster only)*
- *writeConcern*: a shard will refuse to write if less than this amount
  of copies are in sync *(Cluster only)*

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
@startDocuBlockInline dbProperties_cluster
@EXAMPLE_ARANGOSH_OUTPUT{dbProperties_cluster}
  require("@arangodb").db._properties();
@END_EXAMPLE_ARANGOSH_OUTPUT
@endDocuBlock dbProperties_cluster
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

### Use Database

<!-- arangod/V8Server/v8-vocbase.cpp -->

change the current database
`db._useDatabase(name)`

Changes the current database to the database specified by *name*. Note
that the database specified by *name* must already exist.

Changing the database might be disallowed in some contexts, for example
server-side actions (including Foxx).

When performing this command from arangosh, the current credentials (username
and password) will be re-used. These credentials might not be valid to
connect to the database specified by *name*. Additionally, the database
only be accessed from certain endpoints only. In this case, switching the
database might not work, and the connection / session should be closed and
restarted with different username and password credentials and/or
endpoint data.

### List Databases

<!-- arangod/V8Server/v8-vocbase.cpp -->

return the list of all existing databases
`db._databases()`

Returns the list of all databases. This method can only be used from within
the *_system* database.

### Create Database

<!-- arangod/V8Server/v8-vocbase.cpp -->

create a new database
`db._createDatabase(name, options, users)`

Creates a new database with the name specified by *name*.
There are restrictions for database names
(see [DatabaseNames](data-modeling-naming-conventions-database-names.html)).

Note that even if the database is created successfully, there will be no
change into the current database to the new database. Changing the current
database must explicitly be requested by using the
*db._useDatabase* method.

The *options* attribute can be used to set defaults for collections that will
be created in the new database (*Cluster only*):

- *sharding*: The sharding method to use. Valid values are: `""` or `"single"`.
  Setting this option to `"single"` will enable the OneShard feature in the
  Enterprise Edition.
- *replicationFactor*: Default replication factor. Special values include
  `"satellite"`, which will replicate the collection to every DB-Server, and
  `1`, which disables replication.
- *writeConcern*: how many copies of each shard are required to be in sync on
  the different DB-Servers. If there are less then these many copies in the
  cluster a shard will refuse to write. The value of *writeConcern* can not be
  larger than *replicationFactor*.

The optional *users* attribute can be used to create initial users for
the new database. If specified, it must be a list of user objects. Each user
object can contain the following attributes:

- *username*: the user name as a string. This attribute is mandatory.
- *passwd*: the user password as a string. If not specified, then it defaults
  to an empty string.
- *active*: a boolean flag indicating whether the user account should be
  active or not. The default value is *true*.
- *extra*: an optional JSON object with extra user information. The data
  contained in *extra* will be stored for the user but not be interpreted
  further by ArangoDB.

If no initial users are specified, a default user *root* will be created
with an empty string password. This ensures that the new database will be
accessible via HTTP after it is created.

You can create users in a database if no initial user is specified. Switch
into the new database (username and password must be identical to the current
session) and add or modify users with the following commands.

```js
require("@arangodb/users").save(username, password, true);
require("@arangodb/users").update(username, password, true);
require("@arangodb/users").remove(username);
```
Alternatively, you can specify user data directly. For example:

```js
db._createDatabase("newDB", {}, [{ username: "newUser", passwd: "123456", active: true}])
```

Those methods can only be used from within the *_system* database.

### Drop Database

<!-- arangod/V8Server/v8-vocbase.cpp -->

drop an existing database
`db._dropDatabase(name)`

Drops the database specified by *name*. The database specified by
*name* must exist.

**Note**: Dropping databases is only possible from within the *_system*
database. The *_system* database itself cannot be dropped.

Databases are dropped asynchronously, and will be physically removed if
all clients have disconnected and references have been garbage-collected.

### Compact

compact the entire data, for all databases
`db._compact(options)`

Compacts the entire data of all databases. 
The command can be used to reclaim disk space after substantial data deletions 
have taken place. 

The optional *options* attribute can be used to get more control over the 
compaction. The following attributes can be used in it: 

* *changeLevel*: whether or not compacted data should be moved to the minimum
  possible level. The default value is *false*.
* *compactBottomMostLevel*: whether or not to compact the bottommost level of
  data. The default value is *false*.

**Warning**: this command can cause a full rewrite of all data in all databases, 
which may take long for large databases. It should thus only be used with care.

This command requires superuser access and is only available for the RocksDB
storage engine.

### Engine

retrieve the storage engine type used by the server
`db._engine()`

Returns the name of the storage engine in use (`mmfiles` or `rocksdb`), as well
as a list of supported features such as types of indexes.

### Engine statistics

retrieve statistics related to the storage engine
`db._engineStats()`

Returns some statistics related to the storage engine activity, including figures
about data size, cache usage, etc.

Get the Version of ArangoDB
---------------------------

`db._version()`

Returns the server version string. Note that this is not the version of the
database.

**Examples**

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline dbVersion
    @EXAMPLE_ARANGOSH_OUTPUT{dbVersion}
      require("@arangodb").db._version();
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock dbVersion
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}
