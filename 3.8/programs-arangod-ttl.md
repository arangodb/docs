---
layout: default
description: TTL (time-to-live) Options
---
# TTL (time-to-live) Options

## TTL background thread frequency

`--ttl.frequency`

The frequency for invoking the TTL background removal thread. The value for this
option is specified in milliseconds.
The lower this value, the more frequently the TTL background thread will kick in
and scan all available TTL indexes for expired documents, and the earlier the
expired documents will actually be removed.

## TTL maximum total removals

`--ttl.max-total-removes`

In order to avoid "random" load spikes by the background thread suddenly kicking 
in and removing a lot of documents at once, the number of to-be-removed documents
per thread invocation can be capped.

The TTL background thread will go back to sleep once it has removed the configured
number of documents in one iteration. If more candidate documents are left for
removal, they will be removed in following runs of the background thread.

## TTL maximum per-collection removals

`--ttl.max-collection-removes`

This option controls the maximum number of documents to be removed per collection
in each background thread run. This value can be configured separately from the
total removal amount so that the per-collection time window for locking and potential
write-write conflicts can be reduced.
