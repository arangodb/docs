---
fileID: oasisctl-import
title: Oasisctl Import
weight: 2975
description: 
layout: default
---
Import data from a local database or from another remote database into an Oasis deployment.

## Synopsis

Import data from a local database or from another remote database into an Oasis deployment.

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl import [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -b, --batch-size int                     The number of documents to write at once. (default 4096)
  -d, --destination-deployment-id string   Destination deployment id to import data into. It can be provided instead of address, username and password.
      --excluded-collection strings        A list of collections names which should be excluded. Exclusion takes priority over inclusion.
      --excluded-database strings          A list of database names which should be excluded. Exclusion takes priority over inclusion.
      --excluded-graph strings             A list of graph names which should be excluded. Exclusion takes priority over inclusion.
      --excluded-view strings              A list of view names which should be excluded. Exclusion takes priority over inclusion.
  -f, --force                              Force the copy automatically overwriting everything at destination.
  -h, --help                               help for import
      --included-collection strings        A list of collection names which should be included. If provided, only these collections will be copied.
      --included-database strings          A list of database names which should be included. If provided, only these databases will be copied.
      --included-graph strings             A list of graph names which should be included. If provided, only these graphs will be copied.
      --included-view strings              A list of view names which should be included. If provided, only these views will be copied.
  -r, --max-retries int                    The number of maximum retries attempts. Increasing this number will also increase the exponential fallback timer. (default 9)
  -m, --maximum-parallel-collections int   Maximum number of collections being copied in parallel. (default 10)
      --no-progress-bar                    Disable the progress bar but still have partial progress output.
      --query-ttl duration                 Cursor TTL defined as a duration. (default 2h0m0s)
      --source-address string              Source database address to copy data from.
      --source-password string             Source database password if required.
      --source-username string             Source database username if required.
```
{{% /tab %}}
{{< /tabs >}}

## Options inherited from parent commands

{{< tabs >}}
{{% tab name="" %}}
```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```
{{% /tab %}}
{{< /tabs >}}

## See also

* [oasisctl](oasisctl-options)	 - ArangoDB Oasis

