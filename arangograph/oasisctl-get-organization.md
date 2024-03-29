---
layout: default
description: Description of the oasisctl get organization command
title: Oasisctl Get Organization
---
# Oasisctl Get Organization

Get an organization the authenticated user is a member of

## Synopsis

Get an organization the authenticated user is a member of

```
oasisctl get organization [flags]
```

## Options

```
  -h, --help                     help for organization
  -o, --organization-id string   Identifier of the organization
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl get](oasisctl-get.html)	 - Get information
* [oasisctl get organization authentication](oasisctl-get-organization-authentication.html)	 - Get authentication specific information for an organization
* [oasisctl get organization email](oasisctl-get-organization-email.html)	 - Get email specific information for an organization
* [oasisctl get organization invite](oasisctl-get-organization-invite.html)	 - Get an organization invite the authenticated user has access to

