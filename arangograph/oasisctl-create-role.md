---
layout: default
description: Description of the oasisctl create role command
title: Oasisctl Create Role
---
# Oasisctl Create Role

Create a new role

## Synopsis

Create a new role

```
oasisctl create role [flags]
```

## Options

```
      --description string       Description of the role
  -h, --help                     help for role
      --name string              Name of the role
  -o, --organization-id string   Identifier of the organization to create the role in
  -p, --permission strings       Permissions granted by the role
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl create](oasisctl-create.html)	 - Create resources

