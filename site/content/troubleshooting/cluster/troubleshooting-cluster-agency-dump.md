---
fileID: troubleshooting-cluster-agency-dump
title: How to produce an Agency Dump
weight: 1480
description: 
layout: default
---
One can read out all information of an _Agency_ in the following way:

{{< tabs >}}
{{% tab name="" %}}
```
curl -k https://<any-coordinator>:<port>/_api/cluster/agency-dump > agency.json
```
{{% /tab %}}
{{< /tabs >}}

When authentication is enabled, the user provides either an authentication
header to access every server or uses the root user credentials. The
authentication header is generated using the following `arangodb` call:

{{< tabs >}}
{{% tab name="" %}}
```
AUTH=$(arangodb auth header --auth.jwt-secret <path-to-cluster-jwt-secret>)
```
{{% /tab %}}
{{< /tabs >}}

The generated authentication header is then used in the following way with `curl`, to produce the _Agency_ dump:

{{< tabs >}}
{{% tab name="" %}}
```
curl -kH"$AUTH" https://<any-coordinator>:<port>/_api/cluster/agency-dump > agency.json
```
{{% /tab %}}
{{< /tabs >}}

Or using username and password like below, where one is prompted to
type in the password. It is best practices to not specifiy the root
password on command line considering the risks associated with finding
passwords in the shell history. The jwt secret method or username
password method if done like above leaves no such traces.

{{< tabs >}}
{{% tab name="" %}}
```
curl -k --username root https://<any-coordinator>:<port>/_api/cluster/agency-dump
```
{{% /tab %}}
{{< /tabs >}}

Should the _Agency_ be down, an _Agency_ dump can still be created
starting from the database directory of (one of) the _Agents_. Contact
ArangoDB Support, in this case, to obtain more detailed guidelines on
how to produce the dump.
