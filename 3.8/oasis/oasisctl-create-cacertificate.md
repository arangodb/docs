---
layout: default
description: Description of the oasisctl create cacertificate command
title: Oasisctl Create Cacertificate
---
# Oasisctl Create Cacertificate

Create a new CA certificate

## Synopsis

Create a new CA certificate

```
oasisctl create cacertificate [flags]
```

## Options

```
      --description string       Description of the CA certificate
  -h, --help                     help for cacertificate
      --lifetime duration        Lifetime of the CA certificate.
      --name string              Name of the CA certificate
  -o, --organization-id string   Identifier of the organization to create the CA certificate in
  -p, --project-id string        Identifier of the project to create the CA certificate in
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl create](oasisctl-create.html)	 - Create resources

