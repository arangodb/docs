---
fileID: foxx-reference-context
title: Foxx service context
weight: 1115
description: 
layout: default
---
`module.context.use([path], router): Endpoint`

Mounts a given router on the service to expose the router's routes on the
service's mount point.

**Arguments**

* **path**: `string` (Default: `"/"`)

  Path to mount the router at, relative to the service's mount point.

* **router**: `Router | Middleware`

  A router or middleware to mount.

Returns an [Endpoint](routers/foxx-reference-routers-endpoints) for the given router or middleware.

**Note**: Mounting services at run time (e.g. within request handlers or
queued jobs) is not supported.
