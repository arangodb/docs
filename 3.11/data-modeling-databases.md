---
layout: default
description: >-
  Databases let you create fully isolated sets of collections for multi-tenancy
  applications
---
# Databases

{{ page.description }}
{:class="lead"}

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

## Database names

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

## Notes

- Each database contains its own system collections, which need to set up when a
  database is created. This makes the creation of a database take a while.
- Replication can be configured globally or on a per-database level. In the
  latter case, you need to configure any replication logging or applying for new
  databases explicitly after they have been created.
- Foxx applications are only available in the context of the database they have
  been installed in. A new database only provides access to the system
  applications shipped with ArangoDB (mainly the web interface). You need to
  explicitly install other Foxx applications.

## Databases API

The following descriptions cover the JavaScript interface for collections that
you can use to handle collections from the _arangosh_ command-line tool, as
well as in server-side JavaScript code like Foxx microservices.
For other languages see the corresponding language API.

### Set the database context

When you have an established connection to ArangoDB, the current
database can be changed explicitly using the `db._useDatabase()`
method. This switches to the specified database (provided it
exists and the user can connect to it). From this point on, any
following action in the same shell or connection uses the
specified database, unless otherwise specified.

{% hint 'info' %}
If the database is changed, client drivers need to store the
current database name on their side, too. This is because connections
in ArangoDB do not contain any state information. All state information
is contained in the HTTP request/response data.
{% endhint %}

To connect to a specific database after arangosh has started use the command
described above. It is also possible to specify a database name when invoking
arangosh. For this purpose, use the command-line parameter `--server.database`,
e.g.

```sh
arangosh --server.database test
```

Note that commands, actions, scripts or AQL queries should never
access multiple databases, even if they exist. The only intended and
supported way in ArangoDB is to use one database at a time for a command,
an action, a script or a query. Operations started in one database must
not switch the database later and continue operating in another.

Please keep in mind that each database contains its own system collections,
which need to be set up when a database is created. This makes the creation
of a database take a while.

Foxx applications
are also available only in the context of the database they have been installed 
in. A new database only provides access to the system applications shipped
with ArangoDB (that is the web interface at the moment) and no other Foxx
applications until they are explicitly installed for the particular database.
