---
fileID: oasisctl-update-organization-authentication-providers
title: Oasisctl Update Organization Authentication Providers
weight: 3350
description: 
layout: default
---
Update allowed authentication providers for an organization the authenticated user has access to

## Synopsis

Update allowed authentication providers for an organization the authenticated user has access to

{{< tabs >}}
{{% tab name="" %}}
```
oasisctl update organization authentication providers [flags]
```
{{% /tab %}}
{{< /tabs >}}

## Options

{{< tabs >}}
{{% tab name="" %}}
```
      --enable-github              If set, allow access from user accounts authentication through Github
      --enable-google              If set, allow access from user accounts authentication through Google
      --enable-username-password   If set, allow access from user accounts authentication through username-password
  -h, --help                       help for providers
  -o, --organization-id string     Identifier of the organization
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

* [oasisctl update organization authentication](oasisctl-update-organization-authentication)	 - Update authentication settings for an organization

