---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.6
---
Incompatible changes in ArangoDB 3.6
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.6, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.6:

Restricted ranges for date/time values in AQL
---------------------------------------------

ArangoDB 3.6 enforces valid date ranges for working with date/time in AQL. 
The valid date ranges for any AQL date/time function are:

- for string date/time values: `"0000-01-01T00:00:00.000Z"` (including) up to
  `"9999-12-31T23:59:59.999Z"` (including)
- for numeric date/time values: -62167219200000 (including) up to
  253402300799999 (including). These values are the numeric equivalents of
  `"0000-01-01T00:00:00.000Z"` and `"9999-12-31T23:59:59.999Z"`.

Any date/time values outside the given range that are passed into an AQL date
function will make the function return `null` and trigger a warning in the
query, which can optionally be escalated to an error and stop the query.

Any date/time operations that produce date/time outside the valid ranges stated
above will make the function return `null` and trigger a warning too. Example:

```js
DATE_SUBTRACT("2018-08-22T10:49:00+02:00", 100000, "years") // null
```

Startup options
---------------

The following startup options have been removed in ArangoDB 3.6:

- `--vst.maxsize`: this option was used in previous versions to control the
  maximum size (in bytes) of VelocyPack chunks when using the VelocyStream
  (VST) protocol. This is now handled automatically by the server and does not
  need any configuration.

Deprecation of MMFiles Storage Engine
-------------------------------------

The MMFiles storage engine is deprecated starting with version
3.6.0 and it will be removed in a future release.

We recommend to switch to RocksDB even before the removal of MMFiles.
RocksDB is the default [storage engine](architecture-storage-engines.html)
since v3.4.0.

Requests statistics
-------------------

<small>Introduced in: v3.6.5</small>

Previous versions of ArangoDB excluded all requests made to the web interface at
`/_admin/aardvark` from the requests statistics if the request was made for the
`_system` database. Requests for all other endpoints or requests to the same
endpoint for any non-system database were already counted.
ArangoDB now treats all incoming requests to the web interface in the same
way as requests to other endpoints, so the request counters may show higher
values than before in case the web interface was used a lot on the
`_system` database.
