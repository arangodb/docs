---
layout: default
---
# ArangoDB Sink Connector Configuration Properties

## Connection

### connection.endpoints

- type: *list*

Database connection endpoints as comma separated list of `host:port` entries. For
example: `coordinator1:8529,coordinator2:8529`.

### connection.user

- type: *string*
- default: *root*

Database connection user.

### connection.password

- type: *string*

Database connection password.

### connection.database

- type: *string*
- default: *_system*

Target database name.

### connection.collection

- type: *string*

Target collection name.

### connection.acquireHostList.enabled

- type: *boolean*
- default: *false*

Periodically acquire the list of all known ArangoDB hosts in the cluster and trigger tasks reconfiguration in case of
changes.

### connection.acquireHostList.interval.ms

- type: *int*
- default: *60_000*

Interval for acquiring the host list.

### connection.protocol

- type: *string*
- default: *HTTP2*

Communication protocol:

- `VST`
- `HTTP11`
- `HTTP2`

### connection.content.type

- type: *string*
- default: *JSON*

Communication content type:

- `JSON`
- `VPACK`

## SSL

### ssl.enabled

- type: *boolean*
- default: *false*

SSL secured driver connection.

### ssl.cert.value

- type: *string*

Base64 encoded SSL certificate.

### ssl.cert.type

- type: *string*
- default: *X.509*

Certificate type.

### ssl.cert.alias

- type: *string*
- default: *arangodb*

Certificate alias name.

### ssl.algorithm

- type: *string*
- default: *SunX509*

Trust manager algorithm.

### ssl.keystore.type

- type: *string*
- default: *jks*

Keystore type.

### ssl.protocol

- type: *string*
- default: *TLS*

SSLContext protocol.

### ssl.hostname.verification

- type: *boolean*
- default: *true*

SSL hostname verification.

### ssl.truststore.location

- type: *string*

The location of the trust store file.

### ssl.truststore.password

- type: *string*

The password for the trust store file.

## Writes

### insert.overwriteMode

- type: *string*
- default: *conflict*

The overwrite mode to use in case a document with the specified `_key` value already exists:"

- `conflict`: the new document value is not written and an exception is thrown.
- `ignore`: the new document value is not written.
- `replace`: the existing document is overwritten with the new document value.
- `update`: the existing document is patched (partially updated) with the new document value. The behavior can be
  further controlled setting `insert.mergeObjects`.

### insert.mergeObjects

- type: *boolean*
- default: *true*

Whether objects (not arrays) are merged, in case ``insert.overwriteMode`` is set to ``update``:

- ``true``: objects will be merged
- ``false``: existing document fields will be overwritten

### insert.timeout.ms

- type: *int*
- default: *30_000*

Connect and request timeout in ms.

### insert.waitForSync

- type: *boolean*
- default: *false*

Whether to wait until the documents have been synced to disk.

### delete.enabled

- type: *boolean*
- default: *false*

Whether to enable delete behavior when processing tombstones.

## Error handling

### data.errors.tolerance

- type: *string*
- default: *none*

Behavior for tolerating errors during connector operation. ‘none’ is the default value and signals that any error will
result in an immediate connector task failure; ‘all’ changes the behavior to skip over problematic records.

Whether data errors will be tolerated:
- `none`: data errors will result in an immediate connector task failure
- `all`: changes the behavior to skip over records generating data errors. If DLQ is configured, then the record will
  be reported.

### extra.data.error.nums

- type: *list*

Additional server `errorNums` to be considered data errors.

## Retries

### max.retries

- type: *int*
- default: *10*

The maximum number of times to retry transient errors.

### retry.backoff.ms

- type: *int*
- default: *3_000*

The time in milliseconds to wait following an error before a retry attempt is made.
