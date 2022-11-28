---
fileID: oasisctl-update-organization
title: Oasisctl Update Organization
weight: 3605
description: 
layout: default
---
Update an organization the authenticated user has access to

## Synopsis

Update an organization the authenticated user has access to

```
oasisctl update organization [flags]
```

## Options

```
      --description string       Description of the organization
  -h, --help                     help for organization
      --name string              Name of the organization
  -o, --organization-id string   Identifier of the organization
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update]()	 - Update resources
* [oasisctl update organization authentication](oasisctl-update-organization-authentication)	 - Update authentication settings for an organization
* [oasisctl update organization email](oasisctl-update-organization-email)	 - Update email specific information for an organization

