---
layout: default
description: How to transfer backups to external servers.
title: Download Hot Backups to Remote
---
Download a Hot Backup from Remote
===============================

{% hint 'info' %}
This functionality is only available in the Enterprise Edition.
{% endhint %}

Hot backups can be downloaded from remote repository:

```bash
arangobackup download --server.endpoint tcp://myserver:8529 --rclone-config-file /path/to/remote.json --identifier 2019-05-13T07.15.43Z_some-label --remote-path S3://remote-endpoint/remote-directory
```

This process may take as long as it needs to download the data to the
single server or all of the cluster's db servers from the remote
endpoint given network limitations thereto.

The status of the download process may be acquired at any later time.

```bash
arangobackup download --server.endpoint tcp://localhost:9530 --rclone-config-file ~/remote.json --remote-path S3://remote-endpoint/remote-directory --status-id=1234
```

RClone configuration examples
-----------------------------

Enterprise editions of ArangoDB come with a bundled version of the
versatile open-source remote file sync program
[rclone](https://rclone.org, which is distributed under the MIT
license. It is used to both download and upload hot backup sets to and
from local and cloud operated storage resources. 

Backup directories, which are subject to an ongoing download cannot be
used fore restores until the download has finished.

S3
--

```bash 
... --rclone-config-file ~/my-s3.json --remote-path my-s3://remote-endpoint/remote-directory
```
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
More examples and details for S3 configurations can be found [here](https://rclone.org/s3)

Locally mounted local or remote volumes
---------------------------------------

```bash 
... --rclone-config-file ~/my-local.json --remote-path my-local://mnt/backup/arangodb
```
```json
{
  "my-local": {
    "copy-links": false,
    "links": false,
    "one_file_system": false
  }
}
```
More examples and details for local configurations can be found [here](https://rclone.org/local)

WebDAV
------

```bash 
... --rclone-config-file ~/my-dav.json --remote-path my-dav://remote-endpoint/remote-directory
```
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
More examples and details on WebDAV configurations can be found [here](https://rclone.org/webdav)

More examples
-------------

`rclone` is a very flexible tool that can deal with over 30 different
remote file IO protocols. Every industry standard is covered and
documented to some detail including specificities of individual
providers. Please refer to the [rclone documentation](https://rclone.org) 
for more details. 

