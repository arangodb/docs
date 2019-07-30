---
layout: default
description: How to transfer backups to external servers with the arangobackup tool.
title: Upload Backups to Remote
---
Upload a backup to remote
=========================

Backups can be uploaded to a remote repository, here is an example which
uses the `S3` protocol:

```bash
arangobackup upload --server.endpoint tcp://myserver:8529 --rclone-config-file /path/to/remote.json --identifier 2019-05-13T07.15.43Z_some-label --remote-path S3://remote-endpoint/remote-directory
```

The output will look like this:

```
2019-07-30T08:10:10Z [17184] INFO [06792] {backup} Server version: 3.5.1
2019-07-30T08:10:10Z [17184] INFO [a9597] {backup} Backup initiated, use 
2019-07-30T08:10:10Z [17184] INFO [4c459] {backup}     arangobackup upload --status-id=114
2019-07-30T08:10:10Z [17184] INFO [5cd70] {backup}  to query progress.
```

This uses a file `remote.json` in the current directory to configure
credentials for the remote site. Here is an example:

```json
{
  "my-s3": {
    "type": "s3",
    "provider": "aws",
    "env_auth": "false",
    "access_key_id": "XXXXXXXXXXXXXXXXXXXX",
    "secret_access_key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "region": "xx-xxxx-x",
    "acl": "private"
  }
}
```

This process may take as long as it needs to upload the data from the
single server or all of the cluster's db servers to the remote
location. However, the upload will take advantage from previously
uploaded backups which might contain identical files. Therefore, the
functionality is incremental, if regular backups are taken and uploaded
to the same remote site.

The status of the process may be acquired at any later time.

```bash
arangobackup upload --server.endpoint tcp://myserver:8529 --status-id=114
```

where the number given in the `--status-id` option is the one which was
reported in the original upload command.

The output will look like this:

```
2019-07-30T08:11:09Z [17465] INFO [06792] {backup} Server version: 3.5.1
2019-07-30T08:11:09Z [17465] INFO [24d75] {backup} SNGL Status: COMPLETED
2019-07-30T08:11:09Z [17465] INFO [68cc8] {backup} Last progress update 2019-07-30T08:10:10Z: 5/5 files done
```
See the [Download command](programs-arangobackup-download.html) for details
about the `remote.json` file to configure the remote site for `rclone`
for different protocols than `S3`.
