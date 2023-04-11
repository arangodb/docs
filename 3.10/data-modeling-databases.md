---
layout: default
description: >-
  Databases let you create fully isolated sets of collections for multi-tenancy
  applications
redirect_from:
  - data-modeling-naming-conventions-database-names.html # 3.10 -> 3.10
---
# Databases

{{ page.description }}
{:class="lead"}

ArangoDB can handle multiple databases in the same server instance. Databases
can be used to logically group and separate data. An ArangoDB database consists
of collections and dedicated database-specific worker processes. A database
contains its own collections (which cannot be accessed from other databases),
Foxx applications, and replication loggers and appliers. Each ArangoDB database
contains its own system collections (e.g. `_users`, `_graphs`, ...).

There is always at least one database in ArangoDB. This is the default
database named `_system`. This database cannot be dropped and provides special
operations for creating, dropping, and enumerating databases.

You can create additional databases and give them unique names to access them
later. Database management operations cannot be initiated from out of user-defined
databases. You need to use the `_system` database as context.

When ArangoDB is accessed via its HTTP REST API, the database name is read from
the first part of the request URI path (e.g. `/_db/myDB/...`). If the request
URI does not contain a database name, it defaults to `/_db/_system`.
If a database name is provided in the request URI, the name must be properly URL-encoded, and,
if it contains UTF-8 characters, these must be NFC-normalized. Any non-NFC-normalized
database names are rejected by the server.

## Database names

You can give each database you create a name to identify and access it.
The name needs to be unique and conform to the naming convention for databases.

There are two naming conventions available for database names: the **traditional**
and the **extended** naming conventions. Whether the former or the latter is
active depends on the `--database.extended-names-databases` startup option.
The extended naming convention is used if enabled, allowing many special and
UTF-8 characters in database names. If set to `false` (default), the traditional
naming convention is enforced.

{% hint 'info' %}
The extended naming convention is an **experimental** feature
but will become the norm in a future version. Drivers and client applications
should be prepared for this feature.
{% endhint %}

The restrictions of the two naming conventions are:

- For the **traditional** naming convention:
  - Database names must only consist of the letters `a` to `z` (both lower and
    upper case allowed), the numbers `0` to `9`, and the underscore (`_`) or
    dash (`-`) symbols.
    This also means that any non-ASCII database names are not allowed.
  - Database names must always start with a letter. Database names starting
    with an underscore are considered to be system databases, and users should
    not create or delete those.
  - The maximum allowed length of a database name is 64 bytes.
  - Database names are case-sensitive.

- For the **extended** naming convention:
  - Names can consist of most UTF-8 characters, such as Japanese or Arabic
    letters, emojis, letters with accentuation. Some ASCII characters are
    disallowed, but less compared to the  _traditional_ naming convention.
  - Names cannot contain the characters `/` or `:` at any position, nor any
    control characters (below ASCII code 32), such as `\n`, `\t`, `\r`, and `\0`.
  - Spaces are accepted, but only in between characters of the name. Leading
    or trailing spaces are not allowed.
  - `.` (dot), `_` (underscore) and the numeric digits `0`-`9` are not allowed
    as first character, but at later positions.
  - Database names are case sensitive.
  - Database names containing UTF-8 characters must be 
    [NFC-normalized](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms){:target="_blank"}.
    Non-normalized names will be rejected by arangod.
  - The maximum length of a database name is 128 bytes after normalization. 
    As a UTF-8 character may consist of multiple bytes, this does not necessarily 
    equate to 128 characters.

  Example database names that can be used with the _extended_ naming convention:
  `"España", "😀", "犬", "كلب", "@abc123", "København", "München", "Україна", "abc? <> 123!"` 

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

## Notes

- Each database contains its own system collections, which ArangoDB has to set
  up when a database is created. This makes the creation of a database take a while.
- Replication can be configured globally or on a per-database level. In the
  latter case, you need to configure any replication logging or applying for new
  databases explicitly after they have been created.
- Foxx applications are only available in the context of the database they have
  been installed in. A new database only provides access to the system
  applications shipped with ArangoDB (mainly the web interface). You need to
  explicitly install other Foxx applications.

## Database organization on disk

Data is physically stored in `.sst` files in a sub-directory `engine-rocksdb`
that resides in the instance's data directory. A single file can contain
documents of various collections and databases.

ArangoSearch stores data in database-specific directories underneath the
`databases` folder.

Foxx applications are also organized in database-specific directories but inside
the application path. The filesystem layout could look like this:

```
apps/                   # the instance's application directory
  system/               # system applications (can be ignored)
  _db/                  # sub-directory containing database-specific applications
    <database-dir>/     # sub-directory for a single database
      <mountpoint>/APP  # sub-directory for a single application
      <mountpoint>/APP  # sub-directory for a single application
    <database-dir>/     # sub-directory for another database
      <mountpoint>/APP  # sub-directory for a single application
```

The name of `<database-dir>` will be the database's original name or the
database's ID if its name contains special characters.

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
