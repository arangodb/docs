---
layout: default
description: Description of the oasisctl update cacertificate command
title: Oasisctl Update Cacertificate
---
# Oasisctl Update Cacertificate

Update a CA certificate the authenticated user has access to

## Synopsis

Update a CA certificate the authenticated user has access to

```
oasisctl update cacertificate [flags]
```

## Options

```
  -c, --cacertificate-id string      Identifier of the CA certificate
      --description string           Description of the CA certificate
  -h, --help                         help for cacertificate
      --name string                  Name of the CA certificate
  -o, --organization-id string       Identifier of the organization
  -p, --project-id string            Identifier of the project
      --use-well-known-certificate   Sets the usage of a well known certificate ie. Let's Encrypt
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update](oasisctl-update.html)	 - Update resources

