---
layout: default
description: ArangoDB Server ArangoSearch Options
---
# ArangoDB Server ArangoSearch Options

## Threads

`arangosearch.commit-threads`

<small>Introduced in: v3.7.5</small>

The maximum number of threads to use for asynchronous ArangoSearch commit tasks.
The option value must fall in the range `[ 1..4 * NumberOfCores ]`.
Setting it to `0` will automatically choose a sensible number based on the
number of cores in the system.

`arangosearch.commit-threads-idle`

<small>Introduced in: v3.7.5</small>

The minimum number of threads to use for asynchronous ArangoSearch commit tasks.
The option value must fall in the range `[ 1..arangosearch.commit-threads ]`.
Setting it to `0` will automatically choose a sensible number based on the
number of cores in the system.

`arangosearch.consolidation-threads`

<small>Introduced in: v3.7.5</small>

The maximum number of threads to use for asynchronous ArangoSearch
consolidation tasks.
The option value must fall in the range `[ 1..4 * NumberOfCores ]`.
Setting it to `0` will automatically choose a sensible number based on the
number of cores in the system.

`arangosearch.consolidation-threads-idle`

<small>Introduced in: v3.7.5</small>

The minimum number of threads to use for asynchronous ArangoSearch
consolidation tasks.
The option value must fall in the range `[ 1..arangosearch.consolidation-threads ]`.
Setting it to `0` will automatically choose a sensible number based on the
number of cores in the system.

`arangosearch.threads`

<small>Deprecated in: v3.7.5</small>

The exact number of threads to use for asynchronous tasks (0 == autodetect).

{% hint 'info' %}
From version 3.7.5 on, the commit and consolidation thread counts should be
set separately via the following options instead:
- `--arangosearch.commit-threads`
- `--arangosearch.commit-threads-idle`
- `--arangosearch.consolidation-threads`
- `--arangosearch.consolidation-threads-idle`

If either `--arangosearch.commit-threads` or
`--arangosearch.consolidation-threads` is set, then `--arangosearch.threads`
and `arangosearch.threads-limit` are ignored. If only the legacy options are
set, then the commit and consolidation thread counts are calculated as follows:
- Maximum: The smaller value out of `--arangosearch.threads` and
  `arangosearch.threads-limit` divided by 2, but at least 1.
- Minimum: the maximum divided by 2, but at least 1.
{% endhint %}

`arangosearch.threads-limit`

<small>Deprecated in: v3.7.5</small>

Upper limit to the auto-detected number of threads to use for asynchronous
tasks (0 == use default).

{% hint 'info' %}
From version 3.7.5 on, the commit and consolidation thread counts should be
set separately via the following options instead:
- `--arangosearch.commit-threads`
- `--arangosearch.commit-threads-idle`
- `--arangosearch.consolidation-threads`
- `--arangosearch.consolidation-threads-idle`

If either `--arangosearch.commit-threads` or
`--arangosearch.consolidation-threads` is set, then `--arangosearch.threads`
and `arangosearch.threads-limit` are ignored. If only the legacy options are
set, then the commit and consolidation thread counts are calculated as follows:
- Maximum: The smaller value out of `--arangosearch.threads` and
  `arangosearch.threads-limit` divided by 2, but at least 1.
- Minimum: the maximum divided by 2, but at least 1.
{% endhint %}

`arangosearch.skip-recovery`

<small>Introduced in: v3.9.4</small>

Skip data recovery for the specified view links on startup. 
Values for this startup option should have the format `<collection-name>/<link-id>`.
On DB servers, the `<collection-name>` part should contain a shard name.

The option can be used multiple times for each link to skip the recovery for. 
The pseudo-value `all` will disable recovery for all links.

By default, this option has no value(s) and the recovery is not skipped for any
link.

All links that are skipped during recovery, but for which there is recovery data, 
will be permanently marked as "out of sync" when the recovery is 
completed. These links should be recreated manually afterwards to get back 
into sync. How these links respond to queries can be controlled
via the startup option `arangosearch.fail-queries-on-out-of-sync`.

`arangosearch.fail-queries-on-out-of-sync`

<small>Introduced in: v3.9.4</small>

If this option is set to `true`, any data retrieval queries on out of sync links 
will fail with "internal error". Note: this error will change in ArangoDB 3.10
to "collection/view is out of sync" (error code 1481).

The option is set to `false` by default. With this setting, queries on out of sync
links will be answered normally, but the return data may be incomplete.
