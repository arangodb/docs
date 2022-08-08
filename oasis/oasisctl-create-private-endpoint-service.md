---
layout: default
description: Description of the oasisctl create private endpoint service command
title: Oasisctl Create Private Endpoint Service
---
# Oasisctl Create Private Endpoint Service

Create a Private Endpoint Service attached to an existing deployment

## Synopsis

Create a Private Endpoint Service attached to an existing deployment

```
oasisctl create private endpoint service [flags]
```

## Options

```
      --alternate-dns-name strings             DNS names used for the deployment in the private network
      --aws-principal strings                  List of AWS Principals from which a Private Endpoint can be created (Format: <AccountID>[/Role/<RoleName>|/User/<UserName>])
      --azure-client-subscription-id strings   List of Azure subscription IDs from which a Private Endpoint can be created
  -d, --deployment-id string                   Identifier of the deployment that the private endpoint service is connected to
      --description string                     Description of the private endpoint service
  -h, --help                                   help for service
      --name string                            Name of the private endpoint service
  -o, --organization-id string                 Identifier of the organization
  -p, --project-id string                      Identifier of the project
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl create private endpoint](oasisctl-create-private-endpoint.html)	 - 

