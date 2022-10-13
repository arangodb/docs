---
layout: default
description: Description of the oasisctl update notebook command
title: Oasisctl Update Notebook
---
# Oasisctl Update Notebook

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

* [oasisctl update](oasisctl-update.html)	 - Update resources

