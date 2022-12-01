---
fileID: oasisctl-create-cacertificate
title: Oasisctl Create Cacertificate
weight: 2585
description: 
layout: default
---
Create a new CA certificate

## Synopsis

Create a new CA certificate

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl create cacertificate [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --description string       Description of the CA certificate
  -h, --help                     help for cacertificate
      --lifetime duration        Lifetime of the CA certificate.
      --name string              Name of the CA certificate
  -o, --organization-id string   Identifier of the organization to create the CA certificate in
  -p, --project-id string        Identifier of the project to create the CA certificate in
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

* [oasisctl create]()	 - Create resources

