---
layout: default
description: Description of the oasisctl delete group members command
title: Oasisctl Delete Group Members
---
# Oasisctl Delete Group Members

Delete members from group

## Synopsis

Delete members from group

```
oasisctl delete group members [flags]
```

## Options

```
  -g, --group-id string          Identifier of the group to delete members from
  -h, --help                     help for members
  -o, --organization-id string   Identifier of the organization
  -u, --user-emails strings      A comma separated list of user email addresses
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl delete group](oasisctl-delete-group.html)	 - Delete a group the authenticated user has access to

