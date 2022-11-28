---
fileID: oasisctl-delete-group
title: Oasisctl Delete Group
weight: 2905
description: 
layout: default
---
Delete a group the authenticated user has access to

## Synopsis

Delete a group the authenticated user has access to

```
oasisctl delete group [flags]
```

## Options

```
  -g, --group-id string          Identifier of the group
  -h, --help                     help for group
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
* [oasisctl delete group members](oasisctl-delete-group-members)	 - Delete members from group

