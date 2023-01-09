---
fileID: foxx-reference
title: Foxx reference
weight: 1105
description: 
layout: default
---
Each Foxx service is defined by a [JSON manifest](foxx-reference-manifest)
specifying the entry point, any scripts defined by the service,
possible [configuration](foxx-reference-configuration) options and Foxx dependencies,
as well as other metadata. Within a service, these options are exposed as the
[service context](foxx-reference-context), which is also used to mount
[routers](routers/) defining the service's API endpoints.

Foxx also provides a number of [utility modules](related-modules/)
as well as a flexible [sessions middleware](sessions-middleware/)
with different transport and storage mechanisms.

Foxx services can be installed and managed over the Web-UI or through
ArangoDB's [HTTP API](../../http/foxx-services/foxx-management).
