---
fileID: oasisctl-delete-cacertificate
title: Oasisctl Delete Cacertificate
weight: 2705
description: 
layout: default
---
Delete a CA certificate the authenticated user has access to

## Synopsis

Delete a CA certificate the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl delete cacertificate [flags]
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

* [oasisctl delete]()	 - Delete resources

