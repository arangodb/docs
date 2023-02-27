---
layout: default
description: >-
  The HTTP API for databases lets you create and delete databases, list
  available databases, and get information about specific databases
redirect_from:
  - database-notes-on-databases.html # 3.10 -> 3.10
  - database-database-management.html # 3.10 -> 3.10
---
# HTTP Interface for Databases

## Databases

ArangoDB can handle multiple databases in the same server instance. Databases
can be used to logically group and separate data. An ArangoDB database consists
of collections and dedicated database-specific worker processes. A database
contains its own collections (which cannot be accessed from other databases),
Foxx applications and replication loggers and appliers. Each ArangoDB database
contains its own system collections (e.g. `_users`, `_graphs`, ...).

There is always at least one database in ArangoDB. This is the default
database named `_system`. This database cannot be dropped and provides special
operations for creating, dropping and enumerating databases. Users can create
additional databases and give them unique names to access them later. Database
management operations cannot be initiated from out of user-defined databases.

When ArangoDB is accessed via its HTTP REST API, the database name is read from
the first part of the request URI path (e.g. `/_db/myDB/...`). If the request
URI does not contain a database name, it defaults to `/_db/_system`.
If a database name is provided in the request URI, the name must be properly URL-encoded, and,
if it contains UTF-8 characters, these must be NFC-normalized. Any non-NFC-normalized
database names are rejected by the server.

### Database names

A single ArangoDB instance can handle multiple databases in parallel. When
multiple databases are used, each database must be given an unique name.
This name is used to uniquely identify a database. The default database in
ArangoDB is named `_system`.

There are two naming conventions available for database names: the **traditional**
and the **extended** naming conventions. Whether the former or the latter is
active depends on the `--database.extended-names-databases` startup option.
The extended naming convention is used if enabled, allowing many special and
UTF-8 characters in database names. If set to `false` (default), the traditional
naming convention is enforced.

{% hint 'warning' %}
While it is possible to change the value of the
`--database.extended-names-databases` option from `false` to `true` to enable
extended names, the reverse is not true. Once the extended names have been
enabled, they remain permanently enabled so that existing databases with
extended names remain accessible.

Please be aware that dumps containing extended database names cannot be restored
into older versions that only support the traditional naming convention. In a
cluster setup, it is required to use the same database naming convention for all
Coordinators and DB-Servers of the cluster. Otherwise, the startup is
refused. In DC2DC setups it is also required to use the same database naming
convention for both datacenters to avoid incompatibilities.
{% endhint %}

Also see [Database Naming Conventions](../data-modeling-naming-conventions-database-names.html).

### Notes

- Each database contains its own system collections, which need to set up when a
  database is created. This makes the creation of a database take a while.
- Replication can be configured globally or on a per-database level. In the
  latter case, you need to configure any replication logging or applying for new
  databases explicitly after they have been created.
- Foxx applications are only available in the context of the database they have
  been installed in. A new database only provides access to the system
  applications shipped with ArangoDB (mainly the web interface). You need to
  explicitly install other Foxx applications.

## Addresses of databases

Any operation triggered via ArangoDB's RESTful HTTP API is executed in the
context of exactly one database. To explicitly specify the database in a request,
the request URI must contain the database name before the actual path:

```
http://localhost:8529/_db/mydb/...
```

The `...` placeholder is the actual path to the accessed resource. In the example,
the resource is accessed in the context of the `mydb` database . Actual URLs in
the context of `mydb` could look like this:

```
http://localhost:8529/_db/mydb/_api/version
http://localhost:8529/_db/mydb/_api/document/test/12345
http://localhost:8529/_db/mydb/myapp/get
```

Special characters in database names must be properly URL-encoded, e.g.
`a + b = c` needs to be encoded as `a%20%2B%20b%20%3D%20c`:

```
http://localhost:8529/_db/a%20%2B%20b%20%3D%20c/_api/version
```

Database names containing Unicode must be properly
[NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms){:target="_blank"}.
Non-NFC-normalized names are rejected by the server.

## Database management API

The HTTP interface for databases provides operations to create and drop
individual databases. These are mapped to the standard `POST` and `DELETE`
HTTP methods. There is also the `GET` method to retrieve an array of existing
databases.

{% hint 'info' %}
All database management operations can only be accessed via the default
`_system` database and none of the other databases.
{% endhint %}

{% docublock get_api_database_current %}
{% docublock get_api_database_user %}
{% docublock get_api_database_list %}
{% docublock get_api_database_new %}
{% docublock get_api_database_delete %}
