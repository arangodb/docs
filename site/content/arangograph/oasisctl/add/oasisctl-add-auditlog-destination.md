---
fileID: oasisctl-add-auditlog-destination
title: Oasisctl Add Auditlog Destination
weight: 2480
description: 
layout: default
---
Add a destination to an auditlog.

## Synopsis

Add a destination to an auditlog.

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl add auditlog destination [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
  -i, --auditlog-id string                                Identifier of the auditlog
      --destination-excluded-topics strings               Do not send audit events with these topics to this destination.
      --destination-https-client-certificate-pem string   PEM encoded public key of the client certificate.
      --destination-https-client-key-pem string           PEM encoded private key of the client certificate.
      --destination-https-headers strings                 A key=value formatted list of headers for the request. Repeating headers are allowed.
      --destination-https-trusted-server-ca-pem string    PEM encoded public key of the CA used to sign the server TLS certificate. If empty, a well known CA is expected.
      --destination-https-url string                      URL of the server to POST to. Scheme must be HTTPS.
      --destination-type string                           Type of destination. Possible values are: "cloud", "https-post"
  -h, --help                                              help for destination
  -o, --organization-id string                            Identifier of the organization
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

* [oasisctl add auditlog](oasisctl-add-auditlog)	 - Add auditlog resources

