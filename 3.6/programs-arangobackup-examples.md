---
layout: default
description: How to create a consistent snapshot with the arangobackup tool.
title: Create Hot Backups with ArangoDB
---
Hot Backup Examples
===================

Create
------

Hot backups are created near instantaneously. The single server as
well as other deployment modes try to obtain a global write transaction lock
to enforce consistency across all servers, databases, collections
etc. Hot backups still require no Data Definition operations (e.g., create
database, create collection) to be active at the time of hot backup, please
review the [requirements and limitations](backup-restore.html#hot-backup-limitations)
for more details.

Once that lock could be acquired the hot backup itself is most
readily described as a consistent snapshot on the local file system.

```bash
arangobackup create --server.endpoint tcp://myserver:8529 --label my-label 
```

The above will create a hot backup with a unique identifier consisting
of the UTC time according to the local computer clock output and the
specified label and report the success like below.

```
2019-05-15T13:57:11Z [15213] INFO {backup} Server version: 3.5.1
2019-05-15T14:20:16Z [15397] INFO {backup} Backup succeeded. Generated identifier '2019-05-15T14.20.15Z_my-label'
```

{% hint 'tip' %}
If the `label` marker is omitted then a unique identifier string is
generated instead.
{% endhint %}

There are more options for the cluster mode regarding the acquisition of the
global write transaction lock:

- `--max-wait-for-lock`: configures how long the system tries to get the global
  write transaction lock before it reports failure. Its value must be a number
  in seconds (default: 120 seconds).
- `--allow-inconsistent`: if set to `false` (default), the operation is
  considered to have failed if the maximal waiting time for the lock is
  exceeded. If set to `true`, the system will take a potentially non-consistent
  hot backup when the timeout is exceeded.
- `--force`: will make arangobackup abort ongoing write transactions in order
  to more quickly acquire the global write transaction lock. This option should
  be used with caution, as it will potentially abort valid write transactions,
  meaning client applications will see errors for otherwise valid operations
  and queries. The force option currently only aborts stream transactions but
  no JavaScript transactions.

Restore
-------

Once a hot backup is created, one can use the generated backup id,
for example `2019-05-15T14.36.38Z_my-label` to restore the **entire**
instance to that "snapshot". 

{% hint 'warning' %}
Keep in mind that such a restore is a global operation and affects
**all databases** in an installation. The restore will roll back all data
including in the meantime databases, collections, indexes etc.
The DB-Server of a single server instance and all DB-Servers
of a cluster will subsequently be restarted.
{% endhint %}

```bash
arangobackup restore --server.username root --identifier 2019-05-15T14.36.38Z_my-label 
```

The output will reflect the restore operation's success:

```log
2019-05-15T15:24:14Z [16201] INFO {backup} Server version: 3.5.1
2019-05-15T15:24:14Z [16201] INFO {backup} Successfully restored '2019-05-15T14.36.38Z_my-label'
```

Note that current ArangoSearch views are not stored in hot backups,
therefore, after a successful restore operation, all views have to be
dropped and recreated. This is done automatically in the background, but
the recreation of the ArangoSearch indexes can take some time, in
particular if a lot of data has to be indexed.

Delete
------

Hot backups, analogous to virtual machine snapshots, cause additional
disk usage. With every hot backup a consistent state in time is
frozen. Later changes will then have to hold a difference to older
hot backups. Compactions can no longer cover events before the last
hot backup. Naturally, one may want to be able to free disk space, once
hot backups become obsolete. 

```bash
arangobackup delete --server.username root --identifier <identifier>
```

The result of the operation is thus delivered:

```
2019-05-15T15:34:34Z [16257] INFO {backup} Server version: 3.5.1
2019-05-15T15:34:34Z [16257] INFO {backup} Successfully deleted '2019-05-15T13.57.03Z'
```

List
----

One may hold a multitude of hot backups. Those would all be available
to restore from. In order to get a listing of such hot backups, one
may use the `list` command.

```bash 
arangobackup list
```

The output lists all available hot backups:

```bash
2019-05-15T15:28:17Z [16224] INFO {backup} Server version: 3.5.1
2019-05-15T15:28:17Z [16224] INFO {backup} The following backups are available:
2019-05-15T15:28:17Z [16224] INFO {backup}  - 2019-05-15T13.57.11Z_my-label
2019-05-15T15:28:17Z [16224] INFO {backup}  - 2019-05-15T13.57.03Z-other-label
```

Upload
------

Hot backups can be uploaded to a remote repository, here is an example which
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
single server or all of the cluster's DB-Servers to the remote
location. However, the upload will take advantage from previously
uploaded hot backups which might contain identical files. Therefore, the
functionality is incremental, if regular hot backups are taken and uploaded
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

See [rclone Configuration](#rclone-configuration) for details about the `remote.json`
file to configure the remote site for `rclone` for different protocols than S3.

Download
--------

Hot backups can be downloaded from a remote repository like this:

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
the single server or all of the cluster's DB-Servers from the remote
endpoint given network limitations. However, the download will take
advantage from other hot backups which might already or still be present
locally that contain identical files. Therefore, the functionality is
incremental, if a hot backup is downloaded and a similar one is already
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

Rclone Configuration
--------------------

[Rclone](https://rclone.org/){:target="_blank"} is a versatile open-source
remote file sync program that can deal with over 30 different remote file
IO protocols. Enterprise Editions of ArangoDB come with a bundled version
of rclone, which is distributed under the MIT license. It is used to
both download and upload hot backup sets to and from local and cloud
operated storage resources.

{% hint 'info' %}
Hot backup directories, which are subject to an ongoing download cannot
be used for restores until the download has finished.
{% endhint %}

To configure rclone, use the `rclone-config-file` startup option to
point arangobackup to a JSON configuration file. The expected format
is an object with user-chosen remote names as attribute keys, and the
actual configuration as attribute value (a nested object). The option
names and values in the [rclone documentation](https://rclone.org/docs/){:target="_blank"}
directly translate into attribute/value pairs in the JSON file.
Note that `"true"` and `"false"` must be enclosed by double quotes.

```json
{
  "my-remote": {
    "option": "value",
    "boolean": "true"
  }
}
```

The remote path can be specified via the `remote-path` startup option.
The syntax for remote paths is `remote:path`, where `remote` is the
name of a top-level attribute in the configuration file, `path` is a
remote path, and both are separated by a colon (e.g. `my-remote:/a/b/c`).

{% hint 'info' %}
Some cloud vendors require rclone configuration parameters, which are very
specific. It is helpful to download a standalone version of rclone and try to
upload and download files to verify that one has a working configuration for
the cloud storage in question. The exhaustive documentation parameters of `S3`
for example are found at [rclone.org/s3/](https://rclone.org/s3/){:target="_blank"}.
Every parameter can be executed as an option to the program invocation, say
`--s3-upload-cutoff=0`, as an environment variable like
`export RCLONE_S3_UPLOAD_CUTOFF=0`, or most importantly, for use with ArangoDB,
as a key value pair for the JSON files below, `{ ..., "upload_cutoff": 0, ... }`.
{% endhint %}

### S3

```bash 
… --rclone-config-file ~/my-s3.json --remote-path my-s3://remote-endpoint/remote-directory
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

More examples and details for S3 configurations can be found at
[rclone.org/s3/](https://rclone.org/s3/){:target="_blank"}.

### Locally mounted local or remote volumes

```bash 
… --rclone-config-file ~/my-local.json --remote-path my-local://mnt/backup/arangodb
```

The file `my-local.json` could look like this:

```json
{
  "my-local": {
    "type": "local",
    "copy-links": "false",
    "links": "false",
    "one_file_system": "false"
  }
}
```

More examples and details for local configurations can be found at
[rclone.org/local/](https://rclone.org/local/){:target="_blank"}.

### WebDAV

```bash 
… --rclone-config-file ~/my-dav.json --remote-path my-dav://remote-endpoint/remote-directory
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
[rclone.org/webdav/](https://rclone.org/webdav/){:target="_blank"}.
