---
fileID: programs
title: Programs & Tools
weight: 200
description: 
layout: default
---
The full ArangoDB package ships with the following programs and tools:

| Binary name     | Brief description |
|-----------------|-------------------|
| `arangod`       | [ArangoDB server](arangodb-server/). This server program is intended to run as a daemon process / service to serve the various client connections to the server via TCP / HTTP. It also provides a [web interface](web-interface/).
| `arangosh`      | [ArangoDB shell](arangodb-shell/). A client that implements a read-eval-print loop (REPL) and provides functions to access and administrate the ArangoDB server.
| `arangodb`      | [ArangoDB Starter](arangodb-starter/) for easy deployment of ArangoDB instances.
| `arangodump`    | Tool to [create backups](arangodump/) of an ArangoDB database.
| `arangorestore` | Tool to [load backups](arangorestore/) back into an ArangoDB database.
| `arangobackup`  | Tool to [perform hot backup operations](arangobackup/) on an ArangoDB installation.
| `arangoimport`  | [Bulk importer](arangoimport/) for the ArangoDB server. It supports JSON and CSV.
| `arangoexport`  | [Bulk exporter](arangoexport/) for the ArangoDB server. It supports JSON, CSV and XML.
| `arangobench`   | [Benchmark and test tool](arangobench/). It can be used for performance and server function testing.
| `arangovpack`   | Utility to validate and [convert VelocyPack](arangovpack/) and JSON data.
| `arangoinspect` | [Inspection tool](arangoinspect/) that gathers server setup information.

The client package comes with a subset of programs and tools:

- arangosh
- arangoimport
- arangoexport
- arangodump
- arangorestore
- arangobackup
- arangobench
- arangoinspect
- arangovpack

Additional tools which are available separately:

| Name            | Brief description |
|-----------------|-------------------|
| [Foxx CLI](foxx-cli/) | Command line tool for managing and developing Foxx services
| [kube-arangodb](../deployment/by-technology/kubernetes/) | Operators to manage Kubernetes deployments
| [Oasisctl](../arangograph/oasisctl/) | Command-line tool for managing the ArangoGraph Insights Platform
