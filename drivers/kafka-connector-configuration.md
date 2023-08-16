---
layout: default
---
# ArangoDB Sink Connector Configuration Properties

## Connection

### connection.endpoints

- type: _list_

Database connection endpoints as comma separated list of `host:port` entries.
For example: `coordinator1:8529,coordinator2:8529`.

### connection.user

- type: _string_
- default: `root`

Database connection user.

### connection.password

- type: _string_

Database connection password.

### connection.database

- type: _string_
- default: `_system`

Target database name.

### connection.collection

- type: _string_

Target collection name.

### connection.acquireHostList.enabled

- type: _boolean_
- default: `false`

Periodically acquire the list of all known ArangoDB hosts in the cluster and
trigger tasks reconfiguration in case of changes.

### connection.acquireHostList.interval.ms

- type: _int_
- default: `60_000`

Interval for acquiring the host list.

### connection.protocol

- type: _string_
- default: `HTTP2`

Communication protocol:

- `VST`
- `HTTP11`
- `HTTP2`

### connection.content.type

- type: _string_
- default: `JSON`

Communication content type:

- `JSON`
- `VPACK`

## SSL

### ssl.enabled

- type: _boolean_
- default: `false`

SSL secured driver connection.

### ssl.cert.value

- type: _string_

Base64 encoded SSL certificate.

### ssl.cert.type

- type: _string_
- default: `X.509`

Certificate type.

### ssl.cert.alias

- type: _string_
- default: `arangodb`

Certificate alias name.

### ssl.algorithm

- type: _string_
- default: `SunX509`

Trust manager algorithm.

### ssl.keystore.type

- type: _string_
- default: `jks`

Keystore type.

### ssl.protocol

- type: _string_
- default: `TLS`

SSLContext protocol.

### ssl.hostname.verification

- type: _boolean_
- default: `true`

SSL hostname verification.

### ssl.truststore.location

- type: _string_

The location of the trust store file.

### ssl.truststore.password

- type: _string_

The password for the trust store file.

## Writes

### insert.overwriteMode

- type: _string_
- default: `conflict`

The overwrite mode to use in case a document with the specified `_key` value
already exists:

- `conflict`: the new document value is not written and an exception is thrown.
- `ignore`: the new document value is not written.
- `replace`: the existing document is overwritten with the new document value.
- `update`: the existing document is patched (partially updated) with the new
  document value. The behavior can be further controlled with the
  `insert.mergeObjects` setting.

### insert.mergeObjects

- type: _boolean_
- default: `true`

Whether objects (not arrays) are merged, in case `insert.overwriteMode` is set
to `update`:

- `true`: objects are merged
- `false`: existing document fields are overwritten

### insert.timeout.ms

- type: _int_
- default: `30_000`

Connect and request timeout in ms.

### insert.waitForSync

- type: _boolean_
- default: `false`

Whether to wait until the documents have been synced to disk.

### delete.enabled

- type: _boolean_
- default: `false`

Whether to enable delete behavior when processing tombstones.

## Error handling

### data.errors.tolerance

- type: _string_
- default: `none`

Whether data errors are tolerated during connector operation.

- `none`: data errors result in an immediate connector task failure
- `all`: changes the behavior to skip over records generating data errors.
  If DLQ is configured, then the record is reported.

### extra.data.error.nums

- type: _list_

Additional server `errorNums` to be considered data errors.

## Retries

### max.retries

- type: _int_
- default: `10`

The maximum number of times to retry transient errors.

### retry.backoff.ms

- type: _int_
- default: `3_000`

The time in milliseconds to wait following an error before a retry attempt is made.
