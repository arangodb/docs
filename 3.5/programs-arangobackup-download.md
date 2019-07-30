---
layout: default
description: How to transfer backups to external servers.
title: Download Backups to Remote
---
Download a Backup from Remote
=============================

Backups can be downloaded from a remote repository like this:

```bash
arangobackup download --server.endpoint tcp://myserver:8529 --rclone-config-file /path/to/remote.json --identifier 2019-05-13T07.15.43Z_some-label --remote-path S3://remote-endpoint/remote-directory
```

The output will look like this:

```
2019-07-30T08:14:43Z [17621] INFO [06792] {backup} Server version: 3.5.1
2019-07-30T08:14:43Z [17621] INFO [a9597] {backup} Backup initiated, use 
2019-07-30T08:14:43Z [17621] INFO [4c459] {backup}     arangobackup download --status-id=250
2019-07-30T08:14:43Z [17621] INFO [5cd70] {backup}  to query progress.
```

This process may take as long as it needs to download the data to
the single server or all of the cluster's db servers from the remote
endpoint given network limitations. However, the download will take
advantage from other backups which might already or still be present
locally that contain identical files. Therefore, the functionality is
incremental, if a backup is downloaded and a similar one is already
present.

The status of the download process may be acquired at any later time.

```bash
arangobackup download --server.endpoint tcp://myserver:8529 --status-id=250
```

The output will look like this:

```
2019-07-30T08:18:07Z [17753] INFO [06792] {backup} Server version: 3.5.1
2019-07-30T08:18:07Z [17753] INFO [24d75] {backup} SNGL Status: COMPLETED
2019-07-30T08:18:07Z [17753] INFO [68cc8] {backup} Last progress update 2019-07-30T08:14:43Z: 5/5 files done
```

RClone configuration examples
-----------------------------

Enterprise editions of ArangoDB come with a bundled version of the
versatile open-source remote file sync program
[rclone](https://rclone.org), which is distributed under the MIT
license. It is used to both download and upload backup sets to and
from local and cloud operated storage resources. 

Backup directories, which are subject to an ongoing download cannot be
used for restores until the download has finished.

S3
--

```bash 
... --rclone-config-file ~/my-s3.json --remote-path my-s3://remote-endpoint/remote-directory
```

The file `my-s3.json` could look like this:

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

More examples and details for S3 configurations can be found
[here](https://rclone.org/s3). The option names and values in the
_rclone_ configuration directly translate into attribute/value pairs in
the JSON file.

Locally mounted local or remote volumes
---------------------------------------

```bash 
... --rclone-config-file ~/my-local.json --remote-path my-local://mnt/backup/arangodb
```

The file `my-local.json` could look like this:

```json
{
  "my-local": {
    "type": "local",
    "copy-links": false,
    "links": false,
    "one_file_system": false
  }
}
```

More examples and details for local configurations can be found
[here](https://rclone.org/local). The option names and values in the
_rclone_ configuration directly translate into attribute/value pairs in
the JSON file.


WebDAV
------

```bash 
... --rclone-config-file ~/my-dav.json --remote-path my-dav://remote-endpoint/remote-directory
```

Thie file `my-dav.json` could look like this:

```json
{
  "my-dav": {
    "pass": "A0OeLviBmwqKyCi7S6Rnn6dG576cJeRN1Nh0Dm5h8k0",
    "type": "webdav",
    "url": "https://dav.myserver.com",
    "user": "davuser",
    "vendor": "other"
  }
}
```

More examples and details on WebDAV configurations can be found
[here](https://rclone.org/webdav). The option names and values in the
_rclone_ configuration directly translate into attribute/value pairs in
the JSON file.



More examples
-------------

`rclone` is a very flexible tool that can deal with over 30 different
remote file IO protocols. Every industry standard is covered and
documented to some detail including specificities of individual
providers. Please refer to the [rclone documentation](https://rclone.org) 
for more details. 

