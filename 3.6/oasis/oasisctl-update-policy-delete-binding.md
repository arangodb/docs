---
layout: default
description: Description of the oasisctl update policy delete binding command
title: Oasisctl Update Policy Delete Binding
---
# Oasisctl Update Policy Delete Binding

Delete a role binding from a policy

## Synopsis

Delete a role binding from a policy

```
oasisctl update policy delete binding [flags]
```

## Options

```
      --group-id strings   Identifiers of the groups to delete bindings for
  -h, --help               help for binding
  -r, --role-id string     Identifier of the role to delete bind for
  -u, --url string         URL of the resource to update the policy for
      --user-id strings    Identifiers of the users to delete bindings for
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.adbtest.xyz")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update policy delete](oasisctl-update-policy-delete.html)	 - Delete from a policy

