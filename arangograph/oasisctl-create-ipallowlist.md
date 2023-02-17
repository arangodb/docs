---
layout: default
description: Description of the oasisctl create ipallowlist command
title: Oasisctl Create Ipallowlist
---
# Oasisctl Create Ipallowlist

Create a new IP allowlist

## Synopsis

Create a new IP allowlist

```
oasisctl create ipallowlist [flags]
```

## Options

```
      --cidr-range strings          List of CIDR ranges from which deployments are accessible
      --description string          Description of the IP allowlist
  -h, --help                        help for ipallowlist
      --name string                 Name of the IP allowlist
  -o, --organization-id string      Identifier of the organization to create the IP allowlist in
  -p, --project-id string           Identifier of the project to create the IP allowlist in
      --remote-inspection-allowed   If set, remote connectivity checks by the Oasis platform are allowed
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl create](oasisctl-create.html)	 - Create resources

