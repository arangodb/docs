---
layout: default
description: ArangoDB Server Transaction Options
---
# ArangoDB Server Transaction Options

## Streaming Lock Timeout

`transaction.streaming-lock-timeout`

Lock timeout in seconds in case of parallel access to the same
Stream Transaction.

## Streaming Idle Timeout

<small>Introduced in: v3.8.0</small>

`transaction.streaming-idle-timeout`

Idle timeout for Stream Transactions in seconds. Stream transactions will
automatically expire after this period when no further operations are posted
into them. Posting an operation into a non-expired Stream Transaction will
reset the transaction's timeout to the configured idle timeout.
