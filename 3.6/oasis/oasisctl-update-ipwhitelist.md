---
layout: default
description: Description of the oasisctl update ipwhitelist command
title: Oasisctl Update Ipwhitelist
---
# Oasisctl Update Ipwhitelist

Update an IP whitelist the authenticated user has access to

## Synopsis

Update an IP whitelist the authenticated user has access to

```
oasisctl update ipwhitelist [flags]
```

## Options

```
      --add-cidr-range strings      List of CIDR ranges to add to the IP whitelist
      --description string          Description of the CA certificate
  -h, --help                        help for ipwhitelist
  -i, --ipwhitelist-id string       Identifier of the IP whitelist
      --name string                 Name of the CA certificate
  -o, --organization-id string      Identifier of the organization
  -p, --project-id string           Identifier of the project
      --remove-cidr-range strings   List of CIDR ranges to remove from the IP whitelist
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.adbtest.xyz")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update](oasisctl-update.html)	 - Update resources

