---
layout: default
description: ArangoDB Server Transaction Options
---
# ArangoDB Server Transaction Options

## Streaming Lock Timeout

<small>Introduced in: v3.6.5, v3.7.1</small>

`transaction.streaming-lock-timeout`

Lock timeout in seconds in case of parallel access to the same
streaming transaction.

## Streaming Idle Timeout

<small>Introduced in: v3.8.0</small>

`transaction.streaming-idle-timeout`

Idle timeout for streaming transactions in seconds. Streaming
transactions will automatically expire after this period when
no further operations are posted into them. Posting an operation
into a non-expired streaming transaction will increase the
transaction's timeout by the configured idle timeout.
