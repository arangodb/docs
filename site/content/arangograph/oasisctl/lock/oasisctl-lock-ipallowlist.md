---
fileID: oasisctl-lock-ipallowlist
title: Oasisctl Lock Ipallowlist
weight: 3370
description: 
layout: default
---
Lock an IP allowlist, so it cannot be deleted

## Synopsis

Lock an IP allowlist, so it cannot be deleted

```
oasisctl lock ipallowlist [flags]
```

## Options

```
  -h, --help                     help for ipallowlist
  -i, --ipallowlist-id string    Identifier of the IP allowlist
  -o, --organization-id string   Identifier of the organization
  -p, --project-id string        Identifier of the project
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl lock]()	 - Lock resources

