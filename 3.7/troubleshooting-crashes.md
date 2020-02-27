---
layout: default
description: when there is an out-of-memory situation, the Linux operating system is usually configured to kill processes that use most RAM. 
is like the ArangoDB server, arangod.
---

Out of memory crashes
=====================

When there is an out-of-memory situation, the Linux operating system is usually configured 
to kill processes that use most RAM. When running a dedicated database server, this process 
is like the ArangoDB server, arangod.

A system process called OOM (out of memory) killer will send the arangod server a SIGKILL
signal then, which the arangod process can neither detect nor ignore. It will be terminated
ungracefully then.

Usually, the Linux kernel will write information about the killing of processes into its
own system logs. These logs should be checked if you suspect that ArangoDB was killed because
of an out-of-memory situation.

Other crashes
=============

The Linux and MacOS builds of the arangod execuable contain a built-in crash handler. 
The crash handler is supposed to log basic crash information to the ArangoDB logfile in 
case the arangod process receives one of the signals SIGSEGV, SIGBUS, SIGILL, SIGFPE or 
SIGABRT. 

By design, the crash handler cannot kick in in case the operating system sends a SIGKILL 
signal to the arangod process in case of OOM (out of memory).

If possible, the crash handler will also write a backtrace to the logfile, so the crash 
location can be found later by the ArangoDB support. In this case, please provide the
entire crash information from the logfile to the ArangoDB support.

An example log output from the crash handler looks like this:
```
2020-02-17T11:31:53Z [24539] ERROR [a7902] {crash} ArangoDB 3.7.0-devel enterprise [linux], thread 0, tid 24539 [main] caught unexpected signal 11 (SIGSEGV) accessing address 0x000003e800005fd4. displaying 8 stack frame(s). use addr2line to resolve addresses!
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #2: /lib/x86_64-linux-gnu/libpthread.so.0(pthread_cond_timedwait+0x250) [0x7fb2260096e0]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #3: build/bin/arangod(+0x2036398) [0x55eefeaad398]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #4: build/bin/arangod(+0x1f24509) [0x55eefe99b509]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #5: build/bin/arangod(+0x1f2b24e) [0x55eefe9a224e]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #6: build/bin/arangod(+0x518042) [0x55eefcf8f042]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #7: build/bin/arangod(+0x4b00d7) [0x55eefcf270d7]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #8: /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xf3) [0x7fb2257061e3]
2020-02-17T11:31:53Z [24539] INFO [308c2] {crash} - frame #9: build/bin/arangod(+0x5175de) [0x55eefcf8e5de]
2020-02-17T11:31:53Z [24539] INFO [ded81] {crash} available physical memory: 41721982976, rss usage: 301981696, vsz usage: 1245282304, threads: 46
Segmentation fault (core dumped)
```
The backtrace contains some offsets into the executable, which can be resolved to
source code locations by invoking the `addr2line` utility using the offset from the
backtrace and the very same arangod executable.

For example, to resolve the offset `+0x2036398` from frame 3, addr2line can be used
as follows:
```
addr2line -e build/bin/arangod +0x2036398
```
When invoking addr2line, it is absolutely necessary to use the exact same executable
as when the crash happened. Otherwise the offsets will not match and invoking addr2line
will only produce garbage.
In case a release build is used, it may also be useful to install debug symbols first.
Otherwise, addr2line will likely resolve offsets to just `??:?`.
