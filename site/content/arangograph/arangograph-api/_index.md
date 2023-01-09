---
fileID: api
title: The ArangoGraph Insights Platform API
weight: 2345
description: 
layout: default
---
The [ArangoGraph Insights Platform](https://cloud.arangodb.com/home?utm_source=docs&utm_medium=cluster_pages&utm_campaign=docs_traffic),
comes with its own API. This API enables you to control all
resources inside ArangoGraph in a scriptable manner. Typical use cases are spinning
up ArangoGraph deployments during continuous integration and infrastructure as code.

The ArangoGraph API…

- is a well-specified API that uses
  [Protocol Buffers](https://developers.google.com/protocol-buffers/)
  as interface definition and [gRPC](https://grpc.io/) as
  underlying protocol.

- allows for automatic generation of clients for a large list of languages.
  A Go client is available out of the box.

- uses API keys for authentication. API keys impersonate a user and inherit
  the permissions of that user.

- is also available as a command-line tool called [oasisctl](../oasisctl/).

- is also available as a
  [Terraform plugin](https://github.com/arangodb-managed/terraform-provider-oasis/).
  This plugin makes integration of ArangoGraph in infrastructure as code projects
  very simple. To learn more, refer to the [plugin documentation](https://registry.terraform.io/providers/arangodb-managed/oasis/latest/docs).

Also see:
- [github.com/arangodb-managed/apis](https://github.com/arangodb-managed/apis/)
- [API definitions](../../about-arangodb/)
