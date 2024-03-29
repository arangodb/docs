---
layout: default
description: ArangoDB can handle multiple databases in the same server instance.
---
Notes on Databases
==================

Please keep in mind that each database contains its own system collections,
which need to set up when a database is created. This will make the creation
of a database take a while. Replication is configured on a per-database level,
meaning that any replication logging or applying for a new database must
be configured explicitly after a new database has been created. Foxx applications
are also available only in the context of the database they have been installed
in. A new database will only provide access to the system applications shipped
with ArangoDB (that is the web interface at the moment) and no other Foxx
applications until they are explicitly installed for the particular database.

Database
--------

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

Database Name
-------------

A single ArangoDB instance can handle multiple databases in parallel. When
multiple databases are used, each database must be given an unique name.
This name is used to uniquely identify a database. The default database in
ArangoDB is named `_system`. The database name is a string consisting of only
letters, digits and the _ (underscore) and - (dash) characters. User-defined
database names must always start with a letter. Database names are case-sensitive.
