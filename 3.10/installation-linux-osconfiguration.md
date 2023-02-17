---
layout: default
description: Recommendations regarding file systems, memory settings etc.
title: Linux System Configuration for ArangoDB
---
Linux Operating System Configuration
====================================

{% hint 'tip' %}
The most important suggestions listed in this section can be
easily applied by making use of a script. Please refer to the page
[Linux OS Tuning Script Examples](installation-linux-ostuning-scripts.html) for
ready-to-use examples.
{% endhint %}

System Locales
--------------

Some systems may miss the required locale to start the server, resulting in an
error message like the following:

```
FATAL [7ef60] {config} specified language 'en_US' does not match previously used language ''
```

The locale can be generated with the following command:

```bash
sudo locale-gen "en_US.UTF-8"
```

Your distribution may also provide a frontend for doing so, for instance
[`dpkg-reconfigure locales` on Debian](https://wiki.debian.org/Locale){:target="_blank"}.

If you don't set a [default language](programs-arangod-options.html#--default-language)
for the server explicitly, ArangoDB will use the default locale of your system.

{% hint 'warning' %}
The server language is stored in the `LANGUAGE` file in the database directory.
This file should not be modified manually to bypass issues with the locale,
because it may render indexes invalid without raising a warning or error.
Dumping the data and restoring it into an instance that has the correct
language configured is advised.
{% endhint %}

File Systems
------------

We recommend to **not** use BTRFS on linux, as user have reported issues using it in
conjunction with ArangoDB. We experienced ArangoDB facing latency issues when accessing
its database files on BTRFS partitions. In conjunction with BTRFS and AUFS we also saw
data loss on restart.

We would not recommend network filesystems such as NFS for performance reasons,
furthermore we experienced some issues with hard links required for Hot Backup.

Page Sizes
----------

On Linux ArangoDB uses [jemalloc](https://github.com/jemalloc/jemalloc) as
its memory allocator. Unfortunately, some OS configurations can interfere with
jemalloc's ability to function properly. Specifically, Linux's "transparent hugepages",
Windows' "large pages" and other similar features sometimes prevent jemalloc from
returning unused memory to the operating system and result in unnecessarily high
memory use. Therefore, we recommend disabling these features when using jemalloc with
ArangoDB. Please consult your operating system's documentation for how to do this.

Execute:

```bash
sudo bash -c "echo madvise >/sys/kernel/mm/transparent_hugepage/enabled"
sudo bash -c "echo madvise >/sys/kernel/mm/transparent_hugepage/defrag"
```

before executing `arangod`.

Swap Space
----------

It is recommended to assign swap space for a server that is running arangod.
Configuring swap space can prevent the operating system's OOM killer from
killing ArangoDB too eagerly on Linux.

Overcommit Memory
-----------------

The recommended kernel setting for `overcommit_memory` is 0 or 1.
The Linux kernel default is 0.

You can set it as follows before executing `arangod`:

```bash
sudo bash -c "echo 0 >/proc/sys/vm/overcommit_memory"
```

From [www.kernel.org](https://www.kernel.org/doc/Documentation/sysctl/vm.txt){:target="_blank"}:

- When this flag is 0, the kernel attempts to estimate the amount
  of free memory left when userspace requests more memory.

- When this flag is 1, the kernel pretends there is always enough
  memory until it actually runs out.

- When this flag is 2, the kernel uses a "never overcommit"
  policy that attempts to prevent any overcommit of memory.

Experience has shown that setting `overcommit_memory` to a value of 2 has severe
negative side-effects when running arangod, so it should be avoided at all costs.

Max Memory Mappings
-------------------

Linux kernels by default restrict the maximum number of memory mappings of a
single process to about 64K mappings. While this value is sufficient for most
workloads, it may be too low for a process that has lots of parallel threads
that all require their own memory mappings. In this case all the threads'
memory mappings will be accounted to the single arangod process, and the
maximum number of 64K mappings may be reached. When the maximum number of
mappings is reached, calls to mmap will fail, so the process will think no
more memory is available although there may be plenty of RAM left.

To avoid this scenario, it is recommended to raise the default value for the
maximum number of memory mappings to a sufficiently high value. As a rule of
thumb, one could use 8 times the number of available cores times 8,000.

For a 32 core server, a good rule-of-thumb value thus would be 2,048,000
(32 * 8 * 8000). For certain workloads, it may be sensible to use even a higher
value for the number of memory mappings.

To set the value once, use the following command before starting arangod:

```bash
sudo bash -c "sysctl -w 'vm.max_map_count=2048000'"
```

To make the settings durable, it will be necessary to store the adjusted
settings in /etc/sysctl.conf or other places that the operating system is
looking at.

Memory Limits
-------------

A long-running arangod process may accumulate a lot of virtual memory after a
while, so it is recommended to **not** restrict the amount of virtual memory
that a process can acquire, neither via using `ulimit`, `cgroups` or systemd.

Zone Reclaim
------------

Execute

```bash
sudo bash -c "echo 0 >/proc/sys/vm/zone_reclaim_mode"
```

before executing `arangod`.

From [www.kernel.org](https://www.kernel.org/doc/Documentation/sysctl/vm.txt){:target="_blank"}:

This is value ORed together of

- 1 = Zone reclaim on
- 2 = Zone reclaim writes dirty pages out
- 4 = Zone reclaim swaps pages

NUMA
----

Multi-processor systems often have non-uniform Access Memory (NUMA). ArangoDB
should be started with interleave on such system. This can be achieved using

```bash
numactl --interleave=all arangod ...
```

Open Files Limit
----------------

An arangod instance may need to use a lot of file descriptors for working with
files and network resources. It is therefore required to allow arangod processes
to use a lot of file descriptors at the same time. A reasonable value for the
maximum number of open file descriptors for an arangod process is 1048576. This
should provide enough headroom so that arangod doesn't run out of file descriptors.

The maximum number of file descriptors can be adjusted using `ulimit`, `cgroups`
and `systemd`.


Environment Variables
---------------------

It is recommended to set the environment variable `GLIBCXX_FORCE_NEW` to 1 on
systems that use glibc++ in order to disable the memory pooling built into
glibc++. That memory pooling is unnecessary because Jemalloc will already do
memory pooling.

Execute

```bash
export GLIBCXX_FORCE_NEW=1
```

before starting `arangod`.

32bit
-----

While it should be possible to compile ArangoDB on 32bit system, this is not a
recommended environment. 64bit systems can address a significantly larger
memory region. This is also the reason why only 64bit release builds are supplied
by ArangoDB Inc.
