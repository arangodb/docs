---
layout: default
description: The ArangoDB server can listen for incoming requests on multiple endpoints
---
# ArangoDB Server _Server_ Options

### Hot-Reload of JWT Secrets

<small>Introduced in: v3.7.0</small>

{% include hint-ee.md feature="Hot-reloading of secrets" %}

JWT secrets can be reloaded from disk without restarting the server or the
nodes of a cluster deployment. It is supported for both, single keyfiles
and secret folders (multiple secrets).

This may be used to roll out new JWT secrets throughout an ArangoDB cluster.
See [General HTTP Request Handling](http/general.html#hot-reload-of-jwt-secrets).
