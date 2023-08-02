---
layout: default
description: Description of the oasisctl update deployment command
title: Oasisctl Update Deployment
---
# Oasisctl Update Deployment

Update a deployment the authenticated user has access to

## Synopsis

Update a deployment the authenticated user has access to

```
oasisctl update deployment [flags]
```

## Options

```
  -c, --cacertificate-id string              Identifier of the CA certificate to use for the deployment
      --coordinator-memory-size int32        Set memory size of Coordinators for flexible deployments (GB) (default 4)
      --coordinators int32                   Set number of Coordinators for flexible deployments (default 3)
      --custom-image string                  Set a custom image to use for the deployment. Only available for selected customers.
      --dbserver-disk-size int32             Set disk size of DB-Servers for flexible deployments (GB) (default 32)
      --dbserver-memory-size int32           Set memory size of DB-Servers for flexible deployments (GB) (default 4)
      --dbservers int32                      Set number of DB-Servers for flexible deployments (default 3)
  -d, --deployment-id string                 Identifier of the deployment
      --description string                   Description of the deployment
      --disable-foxx-authentication          Disable authentication of requests to Foxx application.
      --disk-performance-id string           Set the disk performance to use for this deployment.
  -h, --help                                 help for deployment
  -i, --ipallowlist-id string                Identifier of the IP allowlist to use for the deployment
      --is-platform-authentication-enabled   Enable platform authentication for deployment.
      --max-node-disk-size int32             Set maximum disk size for nodes for autoscaler (GB)
      --model string                         Set model of the deployment (default "oneshard")
      --name string                          Name of the deployment
      --node-count int32                     Set the number of desired nodes (default 3)
      --node-disk-size int32                 Set disk size for nodes (GB)
      --node-size-id string                  Set the node size to use for this deployment
      --notification-email-address strings   Set email address(-es) that will be used for notifications related to this deployment.
  -o, --organization-id string               Identifier of the organization
  -p, --project-id string                    Identifier of the project
      --version string                       Version of ArangoDB to use for the deployment
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update](oasisctl-update.html)	 - Update resources

