---
fileID: oasisctl-lock-cacertificate
title: Oasisctl Lock Cacertificate
weight: 3360
description: 
layout: default
---
Lock a CA certificate, so it cannot be deleted

## Synopsis

Lock a CA certificate, so it cannot be deleted

```
oasisctl lock cacertificate [flags]
```

## Options

```
  -c, --cacertificate-id string   Identifier of the CA certificate
  -h, --help                      help for cacertificate
  -o, --organization-id string    Identifier of the organization
  -p, --project-id string         Identifier of the project
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl lock]()	 - Lock resources

