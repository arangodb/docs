---
fileID: oasisctl-accept-organization-invite
title: Oasisctl Accept Organization Invite
weight: 2465
description: 
layout: default
---
Accept an organization invite the authenticated user has access to

## Synopsis

Accept an organization invite the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl accept organization invite [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -h, --help                     help for invite
  -i, --invite-id string         Identifier of the organization invite
  -o, --organization-id string   Identifier of the organization
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

* [oasisctl accept organization](oasisctl-accept-organization)	 - Accept organization related invites

