---
fileID: oasisctl-update-role
title: Oasisctl Update Role
weight: 3500
description: 
layout: default
---
Update a role the authenticated user has access to

## Synopsis

Update a role the authenticated user has access to

```
oasisctl update role [flags]
```

## Options

```
      --add-permission strings      Permissions to add to the role
      --description string          Description of the role
  -h, --help                        help for role
      --name string                 Name of the role
  -o, --organization-id string      Identifier of the organization
      --remove-permission strings   Permissions to remove from the role
  -r, --role-id string              Identifier of the role
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update]()	 - Update resources

