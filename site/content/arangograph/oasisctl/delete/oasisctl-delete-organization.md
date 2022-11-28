---
fileID: oasisctl-delete-organization
title: Oasisctl Delete Organization
weight: 2755
description: 
layout: default
---
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

* [oasisctl delete]()	 - Delete resources
* [oasisctl delete organization invite](oasisctl-delete-organization-invite)	 - Delete an organization invite the authenticated user has access to
* [oasisctl delete organization members](oasisctl-delete-organization-members)	 - Delete members from organization

