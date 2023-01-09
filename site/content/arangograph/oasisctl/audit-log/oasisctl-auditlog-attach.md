---
fileID: oasisctl-auditlog-attach
title: Oasisctl Auditlog Attach
weight: 2415
description: 
layout: default
---
Attach a project to an audit log

## Synopsis

Attach a project to an audit log

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl auditlog attach [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-id string       Identifier of the auditlog to attach to.
  -h, --help                     help for attach
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
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

* [oasisctl auditlog]()	 - AuditLog resources

