---
layout: default
description: Description of the oasisctl update organization authentication providers command
title: Oasisctl Update Organization Authentication Providers
---
# Oasisctl Update Organization Authentication Providers

Update allowed authentication providers for an organization the authenticated user has access to

## Synopsis

Update allowed authentication providers for an organization the authenticated user has access to

```
oasisctl update organization authentication providers [flags]
```

## Options

```
      --enable-github              If set, allow access from user accounts authentication through Github
      --enable-google              If set, allow access from user accounts authentication through Google
      --enable-username-password   If set, allow access from user accounts authentication through username-password
  -h, --help                       help for providers
  -o, --organization-id string     Identifier of the organization
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update organization authentication](oasisctl-update-organization-authentication.html)	 - Update authentication settings for an organization

