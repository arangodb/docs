---
fileID: hot-backup
title: HTTP Interface for Hot Backup and Restore
weight: 2320
description: 
layout: default
---
This is an introduction to ArangoDB's HTTP interface for hot backup and restore.

{{< tag "ArangoDB Enterprise" >}}



Hot backups are near instantaneous consistent snapshots of an
**entire** ArangoDB service. This includes all databases, collections,
indexes, view definitions and users at any given time. 

For creations a label may be specified, which if omitted
is replaced with a generated UUID. This label is then combined with a
timestamp to generate an identifier for the created
hot backup. Subsequently, all other APIs operate on these identifiers.

The below APIs exclusively handle POST actions.

{{% hints/warning %}}
Make sure to understand all aspects of [hot backups](../backup-restore/#hot-backups),
most of all the [requirements and limitations](../backup-restore/#hot-backup-limitations),
before using the API.
{{% /hints/warning %}}

```http-spec
openapi: 3.0.2
paths:
  /_admin/backup/create:
    post:
      description: |2+
        Creates a consistent backup "as soon as possible", very much
        like a snapshot in time, with a given label. The ambiguity in the
        phrase "as soon as possible" refers to the next window during which a
        global write lock across all databases can be obtained in order to
        guarantee consistency. Note that the backup at first resides on the
        same machine and hard drive as the original data. Make sure to upload
        it to a remote site for an actual backup.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                label:
                  type: string
                  description: |+
                    The label for this backup. The label is used together with a
                    timestamp string create a unique backup identifier, `<timestamp>_<label>`.
                    If no label is specified, the empty string is assumed and a default
                    UUID is created for this part of the ID.
                timeout:
                  type: number
                  description: |+
                    The time in seconds that the operation tries to get a consistent
                    snapshot. The default is 120 seconds.
                allowInconsistent:
                  type: boolean
                  description: |+
                    If this flag is set to `true` and no global transaction lock can be
                    acquired within the given timeout, a possibly inconsistent backup
                    is taken. The default for this flag is `false` and in this case
                    a timeout results in an HTTP 408 error.
                force:
                  type: boolean
                  description: "If this flag is set to `true` and no global transaction\
                    \ lock can be acquired\nwithin the given timeout, all running\
                    \ transactions are forcefully aborted to\nensure that a consistent\
                    \ backup can be created. This does not include \nJavaScript transactions.\
                    \ It waits for the transactions to be aborted at most \n`timeout`\
                    \ seconds. Thus using `force` the request timeout is doubled.\n\
                    To abort transactions is almost certainly not what you want for\
                    \ your application. \nIn the presence of intermediate commits\
                    \ it can even destroy the atomicity of your\ntransactions. Use\
                    \ at your own risk, and only if you need a consistent backup at\
                    \ \nall costs. The default and recommended value is `false`. If\
                    \ both \n`allowInconsistent` and `force` are set to `true`, then\
                    \ the latter takes \nprecedence and transactions are aborted.\
                    \ This is only available in the cluster.\n\n"
              required: []
      responses:
        '201':
          description: |2+
            If all is well, code 201 is returned.
        '400':
          description: |2+
            If the create command is invoked with bad parameters or any HTTP
            method other than `POST`, then an *HTTP 400* is returned. The specifics
            are detailed in the returned error document.
      tags:
      - BackupRestore
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupCreateBackup
release: stable
version: '3.10'
---
    var url = "/_admin/backup/create";
    var body = {
      label: "foo"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
    body = {
      error:false, code:201,
      result: {
        id: "2019-04-28T12.00.00Z_foo"
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_admin/backup/restore:
    post:
      description: |2+
        Restores a consistent backup from a
        snapshot in time, with a given id. The backup snapshot must reside on
        the ArangoDB service locally.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: |+
                    The id of the backup to restore from.
              required:
              - id
      responses:
        '200':
          description: |2+
            Is returned if the backup could be restored. Note that there is an
            inevitable discrepancy between the single server and the cluster. In a
            single server, the request returns successfully, but the restore is
            only executed afterwards. In the cluster, the request only returns when
            the restore operation has been completed successfully. The cluster
            behaviour is obviously the desired one, but in a single instance, one
            cannot keep a connection open across a restart.
      tags:
      - BackupRestore
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupRestoreBackup
release: stable
version: '3.10'
---
    var backup = require("@arangodb/hotbackup").create();
    var url = "/_admin/backup/restore";
    var body = {
      id: backup.id
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    body = {
      error: false, code: 200,
      result: {
        "previous":"FAILSAFE", "isCluster":false
      }
    };
    // Need to wait for restore to have happened, then need to try any
    // request to reestablish connectivity such that the next request
    // will work again:
    var startTime = require("internal").time();
    var failureSeen = false;
    while (require("internal").time() - startTime < 10) {
      try {
        // GET can throw exceptions
        var r = internal.arango.GET("/_api/version");
        if (r.error === true) {
          failureSeen = true;
        } else {
          if (failureSeen) {
            break;
          }
        }
      } catch(err) {
      }
      require("internal").wait(0.1);
    }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_admin/backup/delete:
    post:
      description: |2+
        Delete a specific local backup identified by the given `id`.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: |+
                    The identifier for this backup.
              required:
              - id
      responses:
        '200':
          description: |2+
            If all is well, this code 200 is returned.
        '400':
          description: |2+
            If the delete command is invoked with bad parameters or any HTTP
            method other than `POST`, then an *HTTP 400* is returned.
      tags:
      - BackupRestore
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupDeleteBackup
release: stable
version: '3.10'
---
    var backup = require("@arangodb/hotbackup").create();
    var url = "/_admin/backup/delete";
    var body = {"id" : backup.id};
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    body = {
      result: {
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_admin/backup/list:
    post:
      description: |2+
        Lists all locally found backups.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: |+
                    The body can either be empty (in which case all available backups are
                    listed), or it can be an object with an attribute `id`, which
                    is a string. In the latter case the returned list
                    is restricted to the backup with the given id.
              required: []
      responses:
        '200':
          description: |2+
            If all is well, code 200 is returned.
        '400':
          description: |2+
            If the list command is invoked with bad parameters, then an *HTTP 400*
            is returned.
        '404':
          description: |2+
            If an `id` or a list of ids was given and the given ids were not found
            as identifiers of a backup, an *HTTP 404 NOT FOUND* is returned.
      tags:
      - BackupRestore
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupListBackup
release: stable
version: '3.10'
---
    var backup = require("@arangodb/hotbackup").create();
    var backup2 = require("@arangodb/hotbackup").create();
    var url = "/_admin/backup/list";
    var body = {};
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    body = {
      result: {
        list: {
            "2019-04-28T12.00.00Z_my-label": {
                "id": "2019-04-28T12.00.00Z_my-label",
                "version": "3.4.5",
                "datetime": "2019-04-28T12.00.00Z",
                "keys": [ {"sha256": "861009ec4d599fab1f40abc76e6f89880cff5833c79c548c99f9045f191cd90b"} ]
            },
            "2019-04-28T12.10.00Z-other-label": {
                "id": "2019-04-28T12.10.00Z-other-label",
                "version": "3.4.5",
                "datetime": "2019-04-28T12.10.00Z",
                "keys": [ {"sha256": "861009ed4d599fab1f40abc76e6f89880cff5833c79c548c99f9045f191cd90b"} ]
            }
        }
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_admin/backup/upload:
    post:
      description: |2+
        Upload a specific local backup to a remote repository, or query
        progress on a previously scheduled upload operation, or abort
        a running upload operation.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: |+
                    The identifier for this backup. This is required when an upload
                    operation is scheduled. In this case leave out the `uploadId`
                    attribute.
                remoteRepository:
                  type: string
                  description: |+
                    URL of remote repository. This is required when an upload operation is
                    scheduled. In this case leave out the `uploadId` attribute. Provided repository
                    URLs are normalized and validated as follows One single colon must appear
                    separating the configuration section name and the path. The URL prefix up to
                    the colon must exist as a key in the config object below. No slashes must
                    appear before the colon. Multiple back to back slashes are collapsed to one, as
                    `..` and `.` are applied accordingly. Local repositories must be absolute
                    paths and must begin with a `/`. Trailing `/` are removed.
                config:
                  type: object
                  description: |+
                    Configuration of remote repository. This is required when an upload
                    operation is scheduled. In this case leave out the `uploadId`
                    attribute. See the description of the _arangobackup_ program in the manual
                    for a description of the `config` object.
                uploadId:
                  type: string
                  description: |+
                    Upload ID to specify for which upload operation progress is queried or
                    the upload operation to abort.
                    If you specify this, leave out all the above body parameters.
                abort:
                  type: boolean
                  description: |+
                    Set this to `true` if a running upload operation should be aborted. In
                    this case, the only other body parameter which is needed is `uploadId`.
              required: []
      responses:
        '200':
          description: |2+
            If all is well, code 200 is returned if progress is inquired or the
            operation is aborted.
        '202':
          description: |2+
            If all is well, code 202 is returned if a new operation is scheduled.
        '400':
          description: |2+
            If the upload command is invoced with bad parameters or any HTTP
            method other than `POST`, then an *HTTP 400* is returned.
        '401':
          description: |2+
            If the authentication to the rempote repository fails, then an *HTTP
            400* is returned.
      tags:
      - BackupRestore
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupUploadBackup
release: stable
version: '3.10'
---
    try {
      require("fs").makeDirectory("/tmp/backups");
    } catch(e) {
    }
    var backup = require("@arangodb/hotbackup").create();
    var url = "/_admin/backup/upload";
    var body = {"id" : backup.id,
                "remoteRepository": "local://tmp/backups",
                "config": {
                  "local": {
                    "type":"local"
                  }
                }
               };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    body = {
      result: {
        uploadId: "10046"
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupUploadBackupStarted
release: stable
version: '3.10'
---
    try {
      require("fs").makeDirectory("/tmp/backups");
    } catch(e) {
    }
    var backup = internal.arango.POST("/_admin/backup/create","");
    var body = {"id" : backup.result.id,
                "remoteRepository": "local://tmp/backups",
                "config": {
                  "local": {
                    "type":"local"
                  }
                }
               };
    var upload = internal.arango.POST("/_admin/backup/upload",body);
    var url = "/_admin/backup/upload";
    var body = {"uploadId" : upload.result.uploadId};
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    body = {
      "result": {
        "Timestamp": "2019-05-14T14:50:56Z",
        "BackupId": "2019-05-01T00.00.00Z_some-label",
        "DBServers": {
          "SNGL": {
            "Status": "COMPLETED"
          }
        }
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


```http-spec
openapi: 3.0.2
paths:
  /_admin/backup/download:
    post:
      description: |2+
        Download a specific local backup from a remote repository, or query
        progress on a previously scheduled download operation, or abort
        a running download operation.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: |+
                    The identifier for this backup. This is required when a download
                    operation is scheduled. In this case leave out the `downloadId`
                    attribute.
                remoteRepository:
                  type: string
                  description: |+
                    URL of remote repository. This is required when a download operation is
                    scheduled. In this case leave out the `downloadId` attribute. Provided
                    repository URLs are normalized and validated as follows One single colon must
                    appear separating the configuration section name and the path. The URL prefix
                    up to the colon must exist as a key in the config object below. No slashes must
                    appear before the colon. Multiple back to back slashes are collapsed to one, as
                    `..` and `.` are applied accordingly. Local repositories must be absolute paths
                    and must begin with a `/`. Trailing `/` are removed.
                config:
                  type: object
                  description: |+
                    Configuration of remote repository. This is required when a download
                    operation is scheduled. In this case leave out the `downloadId`
                    attribute. See the description of the _arangobackup_ program in the manual
                    for a description of the `config` object.
                downloadId:
                  type: string
                  description: |+
                    Download ID to specify for which download operation progress is queried, or
                    the download operation to abort.
                    If you specify this, leave out all the above body parameters.
                abort:
                  type: boolean
                  description: |+
                    Set this to `true` if a running download operation should be aborted. In
                    this case, the only other body parameter which is needed is `downloadId`.
              required:
              - remoteRepository
              - config
      responses:
        '200':
          description: |2+
            If all is well, code 200 is returned if progress is inquired or the
            operation is aborted.
        '202':
          description: |2+
            If all is well, code 202 is returned if a new operation is scheduled.
        '400':
          description: |2+
            If the download command is invoked with bad parameters or any HTTP
            method other than `POST`, then an *HTTP 400* is returned.
        '401':
          description: |2+
            If the authentication to the rempote repository fails, then an *HTTP
            401* is returned.
      tags:
      - BackupRestore
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupDownloadBackup
release: stable
version: '3.10'
---
    var hotbackup = require("@arangodb/hotbackup");
    try {
      require("fs").makeDirectory("/tmp/backups");
    } catch(e) {
    }
    var backup = hotbackup.create();
    var upload = hotbackup.upload(backup.id, "local://tmp/backups",
                                  {local:{type:"local"}});
    // Wait until upload complete:
    for (var count = 0; count < 30; ++count) {
      var progress = hotbackup.uploadProgress(upload.uploadId);
      try {
        if (progress.DBServers.SNGL.Status === "COMPLETED") {
          break;
        }
      } catch(e) {
      }
      internal.wait(0.5);
    }
    hotbackup.delete(backup.id);
    var url = "/_admin/backup/download";
    body = {"id" : backup.id,
            "remoteRepository": "local://tmp/backups",
            "config": {
              "local": {
                "type":"local"
              }
            }
           };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 202);
    logJsonResponse(response);
    body = {
      result: {
        downloadId: "10046"
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestBackupDownloadBackupStarted
release: stable
version: '3.10'
---
    var hotbackup = require("@arangodb/hotbackup");
    try {
      require("fs").makeDirectory("/tmp/backups");
    } catch(e) {
    }
    var backup = hotbackup.create();
    var body = {"id" : backup.id,
                "remoteRepository": "local://tmp/backups",
                "config": {
                  "local": {
                    "type":"local"
                  }
                }
               };
    var upload = hotbackup.upload(backup.id, "local://tmp/backups",
                                  {local:{type:"local"}});
    // Wait until upload complete:
    for (var count = 0; count < 30; ++count) {
      var progress = hotbackup.uploadProgress(upload.uploadId);
      try {
        if (progress.DBServers.SNGL.Status === "COMPLETED") {
          break;
        }
      } catch(e) {
      }
      internal.wait(0.5);
    }
    hotbackup.delete(backup.id);
    var download = hotbackup.download(backup.id, "local://tmp/backups",
                                      {local:{type:"local"}});
    body = {"downloadId" : download.downloadId};
    var url = "/_admin/backup/download";
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    body = {
      "result": {
        "Timestamp": "2019-05-14T14:50:56Z",
        "BackupId": "2019-05-01T00.00.00Z_some-label",
        "DBServers": {
          "SNGL": {
            "Status": "COMPLETED"
          }
        }
      }
    };
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

