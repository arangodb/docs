---
fileID: oasisctl-update-notebook
title: Oasisctl Update Notebook
weight: 3600
description: 
layout: default
---
Update notebook

## Synopsis

Update notebook

```
oasisctl update notebook [flags]
```

## Options

```
  -d, --description string      Description of the notebook
  -s, --disk-size int32         Notebook disk size in GiB
  -h, --help                    help for notebook
      --name string             Name of the notebook
  -n, --notebook-id string      Identifier of the notebook
  -m, --notebook-model string   Identifier of the notebook model
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.arangodb.com")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl update]()	 - Update resources

