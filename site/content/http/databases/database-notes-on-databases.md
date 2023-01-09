---
fileID: database-notes-on-databases
title: Notes on Databases
weight: 1945
description: 
layout: default
---
Please keep in mind that each database contains its own system collections,
which need to set up when a database is created. This will make the creation
of a database take a while. Replication is configured on a per-database level,
meaning that any replication logging or applying for a new database must
be configured explicitly after a new database has been created. Foxx applications
are also available only in the context of the database they have been installed
in. A new database will only provide access to the system applications shipped
with ArangoDB (that is the web interface at the moment) and no other Foxx
applications until they are explicitly installed for the particular database.

## Database

ArangoDB can handle multiple databases in the same server instance. Databases
can be used to logically group and separate data. An ArangoDB database consists
of collections and dedicated database-specific worker processes. A database
contains its own collections (which cannot be accessed from other databases),
Foxx applications and replication loggers and appliers. Each ArangoDB database
contains its own system collections (e.g. `_users`, `_graphs`, ...).

There will always be at least one database in ArangoDB. This is the default
database named `_system`. This database cannot be dropped and provides special
operations for creating, dropping and enumerating databases. Users can create
additional databases and give them unique names to access them later. Database
management operations cannot be initiated from out of user-defined databases.

When ArangoDB is accessed via its HTTP REST API, the database name is read from
the first part of the request URI path (e.g. `/_db/myDB/...`). If the request
URI does not contain a database name, it defaults to `/_db/_system`.
If a database name is provided in the request URI, the name must be properly URL-encoded, and,
if it contains UTF-8 characters, these must be NFC-normalized. Any non-NFC-normalized
database name will be rejected by arangod.

## Database Name

A single ArangoDB instance can handle multiple databases in parallel. When
multiple databases are used, each database must be given an unique name.
This name is used to uniquely identify a database. The default database in
ArangoDB is named `_system`.

There are two naming conventions available for database names: the **traditional**
and the **extended** naming conventions. Whether the former or the latter is
active depends on the `--database.extended-names-databases` startup option.
The extended naming convention is used if enabled, allowing many special and
UTF-8 characters in database names. If set to `false` (default), the traditional
naming convention will be enforced.

{{% hints/warning %}}
While it is possible to change the value of the
`--database.extended-names-databases` option from `false` to `true` to enable
extended names, the reverse is not true. Once the extended names have been
enabled they will remain permanently enabled so that existing databases with
extended names remain accessible.

Please be aware that dumps containing extended database names cannot be restored
into older versions that only support the traditional naming convention. In a
cluster setup, it is required to use the same database naming convention for all
Coordinators and DB-Servers of the cluster. Otherwise the startup will be
refused. In DC2DC setups it is also required to use the same database naming
convention for both datacenters to avoid incompatibilities.
{{% /hints/warning %}}

Also see [Database Naming Conventions](../../getting-started/data-model-concepts/naming-conventions/data-modeling-naming-conventions-database-names).
