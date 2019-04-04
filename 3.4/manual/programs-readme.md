---
layout: default
---
Programs & Tools
================

The full ArangoDB package ships with the following programs and tools:

| Binary name     | Brief description |
|-----------------|-------------------|
| `arangod`       | [ArangoDB server](programs-arangod-readme-md-this-server-program-is-intended-to-run-as-a-daemon-process-service-to-serve-the-various-client-connections-to-the-server-via-t-c-p-h-t-t-p-it-also-provides-a-web-interface-web-interface-r-e-a-d-m-e.html).
| `arangosh`      | [ArangoDB shell](programs-arangosh-readme.html). A client that implements a read-eval-print loop (REPL) and provides functions to access and administrate the ArangoDB server.
| `arangodb`      | [ArangoDB Starter](programs-starter-readme.html) for easy deployment of ArangoDB instances.
| `arangodump`    | Tool to [create backups](programs-arangodump-readme.html) of an ArangoDB database.
| `arangorestore` | Tool to [load backups](programs-arangorestore-readme.html) back into an ArangoDB database.
| `arangoimport`  | [Bulk importer](programs-arangoimport-readme.html) for the ArangoDB server. It supports JSON and CSV.
| `arangoexport`  | [Bulk exporter](programs-arangoexport-readme.html) for the ArangoDB server. It supports JSON, CSV and XML.
| `arango-dfdb`   | [Datafile debugger](programs-arango-dfdb-readme.html) for ArangoDB (MMFiles storage engine only).
| `arangobench`   | [Benchmark and test tool](programs-arangobench-readme.html). It can be used for performance and server function testing.
| `arangoinspect` | [Inspection tool](programs-arangoinspect-readme.html) that gathers server setup information.
| `arangovpack`   | Utility to convert [VelocyPack](https://github.com/arangodb/velocypack) data to JSON.

The client package comes with a subset of programs and tools:

- arangosh
- arangoimport
- arangoexport
- arangodump
- arangorestore
- arangobench
- arangoinspect
- arangovpack

Additional tools which are available separately:

| Name            | Brief description |
|-----------------|-------------------|
| [Foxx CLI](programs-foxx-cli-readme.html) | Command line tool for managing and developing Foxx services
| [kube-arangodb](deployment-kubernetes-readme.html) | Operators to manage Kubernetes deployments
