---
layout: default
description: >-
  Audit logs capture interactions with the database system and allow you to
  check who accessed it, what actions were performed, and how the system
  responded
redirect_from:
  - security-auditing-audit-configuration.html # 3.10 -> 3.10
  - security-auditing-audit-events.html # 3.10 -> 3.10
page-toc:
  max-headline-level: 3
---
# Audit logging

{{ page.description }}
{:class="lead"}

{% capture arangograph %}

A similar feature is also available in the
[ArangoGraph Insights Platform](arangograph/access-control.html#using-an-audit-log).
{% endcapture %}
{% include hint-ee.md feature="Audit logging" extra=arangograph %}

## Configuration

To enable audit logging, set the `--audit.output` startup option to either a
file path (`file://<path-to-file>`) or a syslog server (`syslog://<facility>`).

For information about the startup options for audit logging, see
[ArangoDB Server Options](programs-arangod-options.html#audit).

## Log format

The general format of audit logs is as follows:

```
<time-stamp> | <server> | <topic> | <username> | <database> | <client-ip> | <authentication> | <text1> | <text2> | ...
```

- `time-stamp`: When the event occurred. The timezone is GMT. This allows you to
  easily match log entries from servers in different timezones.

- `server`: The server name. You can specify a custom name on startup with the
  [`--audit.hostname`](programs-arangod-options.html#--audithostname)
  startup option. Otherwise, the default hostname is used.

- `topic`: The log topic of the entry. A topic can be suppressed via the
  `--log.level` startup option or the REST API.

- `username`: The (authenticated or unauthenticated) name supplied by the client.
  A dash (`-`) indicates that no name was given by the client.

- `database`:  The database that was accessed. Note that there are no
  database-crossing queries. Each access is restricted to one database in ArangoDB.

- `client-ip`: The source network address of the request.

- `authentication`: The method used to authenticate the user.

- Details about the request in the additional fields.
  Any additional fields (e.g. `text1` and `text2`) are determined by the type
  of log message. Most messages include a status of `ok` or `failed`.

## Events

Unless otherwise noted, all events are logged to their respective topics at the
`info` level. To suppress events from a given topic, set the topic to the `warn`
level or higher. By default, each topic is set to the most verbose level
at which events are logged (either `debug` or `info`), so that all events are
logged.

### Authentication

#### Unknown authentication methods

```
2016-10-03 15:44:23 | server1 | audit-authentication | n/a | database1 | 127.0.0.1:61525 | n/a | unknown authentication method | /_api/version
```

This message occurs when a request contains an `Authorization` header with
an unknown authentication method. Typically, only `basic` and `bearer` are
accepted.

#### Missing credentials

```
2016-10-03 15:39:49 | server1 | audit-authentication | n/a | database1 | 127.0.0.1:61498 | n/a | credentials missing | /_api/version
```

This message occurs when authentication is enabled and a request omits an
`Authorization` header. Note that this may naturally occur when making an
initial request to e.g. log in or load the web interface. For this reason, such
low-priority events are logged at the `debug` level.

#### Wrong credentials

```
2016-10-03 17:21:22 | server1 | audit-authentication | root | database1 | 127.0.0.1:64214 | http jwt | user 'root' wrong credentials  | /_open/auth
```

This message occurs when a user makes an attempt to log in with incorrect
credentials, or passes a JWT with invalid credentials.

Note that the user given as fourth part is the user that requested the login.
In general, it may be unavailable:

```
2016-10-03 15:47:26 | server1 | audit-authentication | n/a | database1 | 127.0.0.1:61528 | http basic | credentials wrong | /_api/version
```

#### JWT login succeeded

```
2016-10-03 17:21:22 | server1 | audit-authentication | root | database1 | 127.0.0.1:64214 | http jwt | user 'root' authenticated | /_open/auth
```

The message occurs when a user successfully logs in and is given a JWT token
for further use.

Note that the user given as fourth part is the user that requested the login.

### Authorization

#### User not authorized to access database

```
2016-10-03 16:20:52 | server1 | audit-authorization | user1 | database2 | 127.0.0.1:62262 | http basic | not authorized | /_api/version
```

This message occurs when a user attempts to access a database in a manner in
which they have not been granted access.

### Databases

#### Database created

```
2016-10-04 15:33:25 | server1 | audit-database | user1 | database1 | 127.0.0.1:56920 | http basic | create database 'database1' | ok | /_api/database
```

This message occurs whenever a user attempts to create a database. If
successful, the status is `ok`, otherwise `failed`.

#### Database dropped

```
2016-10-04 15:33:25 | server1 | audit-database | user1 | database1 | 127.0.0.1:56920 | http basic | delete database 'database1' | ok | /_api/database
```

This message occurs whenever a user attempts to drop a database. If
successful, the status is `ok`, otherwise `failed`.

### Collections

#### Collection created

```
2016-10-05 17:35:57 | server1 | audit-collection | user1 | database1 | 127.0.0.1:51294 | http basic | create collection 'collection1' | ok | /_api/collection
```

This message occurs whenever a user attempts to create a collection. If
successful, the status is `ok`, otherwise `failed`.

#### Collection truncated

```
2016-10-05 17:36:08 | server1 | audit-collection | user1 | database1 | 127.0.0.1:51294 | http basic | truncate collection 'collection1' | ok | /_api/collection/collection1/truncate
```

This message occurs whenever a user attempts to truncate a collection. If
successful, the status is `ok`, otherwise `failed`.

#### Collection dropped

```
2016-10-05 17:36:30 | server1 | audit-collection | user1 | database1 | 127.0.0.1:51294 | http basic | delete collection 'collection1' | ok | /_api/collection/collection1
```

This message occur whenever a user attempts to drop a collection. If
successful, the status is `ok`, otherwise `failed`.

### Indexes

#### Index created

```
2016-10-05 18:19:40 | server1 | audit-collection | user1 | database1 | 127.0.0.1:52467 | http basic | create index in 'collection1' | ok | {"fields":["a"],"sparse":false,"type":"persistent","unique":false} | /_api/index?collection=collection1
```

This message occurs whenever a user attempts to create an index. If
successful, the status is `ok`, otherwise `failed`.

#### Index dropped

```
2016-10-05 18:18:28 | server1 | audit-collection | user1 | database1 | 127.0.0.1:52464 | http basic | drop index 'collection1/44051' | ok | /_api/index/collection1/44051
```

This message occurs whenever a user attempts to drop an index. If
successful, the status is `ok`, otherwise `failed`.

### Documents

If statistics are enabled, the system will periodically perform several document
operations on a few system collections. These low-priority operations are logged
to the `audit-document` topic at the `debug` level.

#### Single document read

```
2016-10-04 12:27:55 | server1 | audit-document | user1 | database1 | 127.0.0.1:53699 | http basic | read document in 'collection1' | ok | /_api/document/collection1
```

This message occurs whenever a user attempts to read a document. If
successful, the status is `ok`, otherwise `failed`.

#### Single document created

```
2016-10-04 12:27:55 | server1 | audit-document | user1 | database1 | 127.0.0.1:53699 | http basic | create document in 'collection1' | ok | /_api/document/collection1
```

This message occurs whenever a user attempts to create a document. If
successful, the status is `ok`, otherwise `failed`.

#### Single document replaced

```
2016-10-04 12:28:08 | server1 | audit-document | user1 | database1 | 127.0.0.1:53699 | http basic | replace document 'collection1/21456' | ok | /_api/document/collection1/21456?ignoreRevs=false
```

This message occurs whenever a user attempts to replace a document. If
successful, the status is `ok`, otherwise `failed`.

#### Single document updated

```
2016-10-04 12:28:15 | server1 | audit-document | user1 | database1 | 127.0.0.1:53699 | http basic | modify document 'collection1/21456' | ok | /_api/document/collection1/21456?keepNull=true&ignoreRevs=false
```

This message occurs whenever a user attempts to update a document. If
successful, the status is `ok`, otherwise `failed`.

#### Single document deleted

```
2016-10-04 12:28:23 | server1 | audit-document | user1 | database1 | 127.0.0.1:53699 | http basic | delete document 'collection1/21456' | ok | /_api/document/collection1/21456?ignoreRevs=false
```

This message occurs whenever a user attempts to delete a document. If
successful, the status is `ok`, otherwise `failed`.

### Queries

```
2016-10-06 12:12:10 | server1 | audit-document | user1 | database1 | 127.0.0.1:54232 | http basic | query document | ok | for i in collection1 return i | /_api/cursor
```

This message occurs whenever a user attempts to execute a query. If
successful, the status is `ok`, otherwise `failed`.

### Hot Backups

There are three operations which are put into the audit log with respect
to Hot Backups.

#### Hot Backup created

```
2020-01-21 15:29:06 | tux | audit-hotbackup | root | n/a | (internal) | n/a | Hotbackup taken with ID 2020-01-21T15:29:06Z_a98422de-03ab-4b94-8ed9-e084bfd4bae1, result: 0
```

This message occurs whenever a user attempts to create a Hot Backup.
If successful, the status is `0`, otherwise some numerical error code.

#### Hot Backup restored

```
2020-01-21 15:29:42 | tux | audit-hotbackup | root | n/a | (internal) | n/a | Hotbackup restored with ID 2020-01-21T15.29.06Z_a98422de-03ab-4b94-8ed9-e084bfd4bae1, result: 0
```

This message occurs whenever a user attempts to restore from a Hot Backup.
If successful, the status is `0`, otherwise some numerical error code.

#### Hot Backup deleted

```
2020-01-21 15:32:37 | tux | audit-hotbackup | root | n/a | (internal) | n/a | Hotbackup deleted with ID 2020-01-21T15.32.27Z_cf1e3cb1-32c0-41d2-9a3f-528c9b43cbf9, result: 0
```

This message occurs whenever a user attempts to delete a Hot Backup.
If successful, the status is `0`, otherwise some numerical error code.
