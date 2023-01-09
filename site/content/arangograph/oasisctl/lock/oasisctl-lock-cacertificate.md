---
fileID: oasisctl-lock-cacertificate
title: Oasisctl Lock Cacertificate
weight: 3095
description: 
layout: default
---
Lock a CA certificate, so it cannot be deleted

## Synopsis

Lock a CA certificate, so it cannot be deleted

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl lock cacertificate [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -c, --cacertificate-id string   Identifier of the CA certificate
  -h, --help                      help for cacertificate
  -o, --organization-id string    Identifier of the organization
  -p, --project-id string         Identifier of the project
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

* [oasisctl lock]()	 - Lock resources

