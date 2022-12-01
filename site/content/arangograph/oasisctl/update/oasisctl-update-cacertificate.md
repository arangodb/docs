---
fileID: oasisctl-update-cacertificate
title: Oasisctl Update Cacertificate
weight: 3390
description: 
layout: default
---
Update a CA certificate the authenticated user has access to

## Synopsis

Update a CA certificate the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update cacertificate [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -c, --cacertificate-id string      Identifier of the CA certificate
      --description string           Description of the CA certificate
  -h, --help                         help for cacertificate
      --name string                  Name of the CA certificate
  -o, --organization-id string       Identifier of the organization
  -p, --project-id string            Identifier of the project
      --use-well-known-certificate   Sets the usage of a well known certificate ie. Let's Encrypt
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

* [oasisctl update]()	 - Update resources

