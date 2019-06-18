---
layout: default
description: How to transfer backups to external servers with the arangobackup tool.
title: Upload Hot Backups to Remote
---
Upload a hot backup to remote
=============================

{% hint 'info' %}
This functionality is only available with the Enterprise Edition.
Currently `S3` endpoints are the only supported remote endpoint.
{% endhint %}

Hot backups can be uploaded to a remote `S3` repository:

```bash
arangobackup upload --server.endpoint tcp://myserver:8529 --rclone-config-file /path/to/remote.json --identifier 2019-05-13T07.15.43Z_some-label --remote-path S3://remote-endpoint/remote-directory
```

This process may take as long as it needs to upload the data from the
single server or all of the cluster's db servers to the remote
endpoint given network thereto.

The status of the process may be acquired at any later time.

```bash
arangobackup upload --server.endpoint tcp://localhost:9530 --rclone-config-file ~/remote.json --remote-path S3://remote-endpoint/remote-directory --status-id=1234
```
