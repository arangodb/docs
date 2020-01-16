---
layout: default
description: Description of the oasisctl login command
title: Oasisctl Login
---
# Oasisctl Login

Login to ArangoDB Oasis using an API key

## Synopsis

To authenticate in a script environment, run:
	
	export OASIS_TOKEN=$(oasisctl login --key-id=<your-key-id> --key-secret=<your-key-secret>)


```
oasisctl login [flags]
```

## Options

```
  -h, --help                help for login
  -i, --key-id string       API key identifier
  -s, --key-secret string   API key secret
```

## Options inherited from parent commands

```
      --endpoint string   API endpoint of the ArangoDB Oasis (default "api.cloud.adbtest.xyz")
      --format string     Output format (table|json) (default "table")
      --token string      Token used to authenticate at ArangoDB Oasis
```

## See also

* [oasisctl](oasisctl.html)	 - ArangoDB Oasis

