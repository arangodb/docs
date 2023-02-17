---
layout: default
description: One can read out all information of an Agency in the following way
---
How to produce an Agency Dump
=============================

One can read out all information of an _Agency_ in the following way:

```
curl -k https://<any-coordinator>:<port>/_api/cluster/agency-dump > agency.json
```

When authentication is enabled, the user provides either an authentication
header to access every server or uses the root user credentials. The
authentication header is generated using the following `arangodb` call:

```
AUTH=$(arangodb auth header --auth.jwt-secret <path-to-cluster-jwt-secret>)
```

The generated authentication header is then used in the following way with `curl`, to produce the _Agency_ dump:

```
curl -kH"$AUTH" https://<any-coordinator>:<port>/_api/cluster/agency-dump > agency.json
```

Or using username and password like below, where one is prompted to
type in the password. It is best practices to not specifiy the root
password on command line considering the risks associated with finding
passwords in the shell history. The jwt secret method or username
password method if done like above leaves no such traces.

```
curl -k --username root https://<any-coordinator>:<port>/_api/cluster/agency-dump
```

Should the _Agency_ be down, an _Agency_ dump can still be created
starting from the database directory of (one of) the _Agents_. Contact
ArangoDB Support, in this case, to obtain more detailed guidelines on
how to produce the dump.
