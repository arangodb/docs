---
layout: default
description: Description of the oasisctl delete organization command
title: Oasisctl Delete Organization
---
# Oasisctl Delete Organization

Delete an organization the authenticated user has access to

## Synopsis

Delete an organization the authenticated user has access to

```
oasisctl delete organization [flags]
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

* [oasisctl delete](oasisctl-delete.html)	 - Delete resources
* [oasisctl delete organization invite](oasisctl-delete-organization-invite.html)	 - Delete an organization invite the authenticated user has access to
* [oasisctl delete organization members](oasisctl-delete-organization-members.html)	 - Delete members from organization

