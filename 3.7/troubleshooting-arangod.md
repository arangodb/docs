---
layout: default
description: If the server does not start, you cannot connect to it or if it crashes then read on.
title: Troubleshooting ArangoDB Server
---
Troubleshooting Arangod
=======================

Server not starting or not reachable
------------------------------------

If the ArangoDB server does not start or if you cannot connect to it 
using *arangosh* or other clients, you can try to find the problem cause by 
executing the following steps. If the server starts up without problems
you can skip this section.

- *Check the server log file*: If the server has written a log file you should 
  check it because it might contain relevant error context information.

- *Check the configuration*: The server looks for a configuration file 
  named *arangod.conf* on startup. The contents of this file will be used
  as a base configuration that can optionally be overridden with command-line 
  configuration parameters. You should check the config file for the most
  relevant parameters such as:
  - *server.endpoint*: What IP address and port to bind to
  - *log parameters*: If and where to log
  - *database.directory*: Path the database files are stored in

  If the configuration reveals that something is not configured right the config
  file should be adjusted and the server be restarted.

- *Start the server manually and check its output*: Starting the server might
  fail even before logging is activated so the server will not produce log
  output. This can happen if the server is configured to write the logs to
  a file that the server has no permissions on. In this case the server 
  cannot log an error to the specified log file but will write a startup 
  error on stderr instead.
  Starting the server manually will also allow you to override specific 
  configuration options, e.g. to turn on/off file or screen logging etc.

- *Check the TCP port*: If the server starts up but does not accept any incoming 
  connections this might be due to firewall configuration between the server 
  and any client(s). The server by default will listen on TCP port 8529. Please 
  make sure this port is actually accessible by other clients if you plan to use 
  ArangoDB in a network setup.

  When using hostnames in the configuration or when connecting, please make
  sure the hostname is actually resolvable. Resolving hostnames might invoke
  DNS, which can be a source of errors on its own.

  It is generally good advice to not use DNS when specifying the endpoints
  and connection addresses. Using IP addresses instead will rule out DNS as 
  a source of errors. Another alternative is to use a hostname specified
  in the local */etc/hosts* file, which will then bypass DNS.

- *Test if *curl* can connect*: Once the server is started, you can quickly
  verify if it responds to requests at all. This check allows you to
  determine whether connection errors are client-specific or not. If at 
  least one client can connect, it is likely that connection problems of
  other clients are not due to ArangoDB's configuration but due to client
  or in-between network configurations.

  You can test connectivity using a simple command such as:

  **curl --dump - --user "username:password" -X GET http://127.0.0.1:8529/_api/version && echo**

  (Replace `username` and `password` with the actual credentials.)

  This should return a response with an *HTTP 200* status code when the
  server is running. If it does it also means the server is generally 
  accepting connections. Alternative tools to check connectivity are *lynx*
  or *ab*.

Out of memory crashes
---------------------

When there is an out-of-memory situation, the Linux operating system is usually
configured to kill processes that use most RAM. When running a dedicated
database server, this process is like the ArangoDB server, arangod.

A system process called OOM (out of memory) killer will send the arangod server
a SIGKILL signal then, which the arangod process can neither detect nor ignore.
It will be terminated ungracefully then.

Usually, the Linux kernel will write information about the killing of processes
into its own system logs. These logs should be checked if you suspect that
ArangoDB was killed because of an out-of-memory situation.

Other crashes
-------------

The Linux and MacOS builds of the arangod executable contain a built-in crash
handler (introduced in v3.7.0). The crash handler is supposed to log basic
crash information to the ArangoDB logfile in case the arangod process receives
one of the signals SIGSEGV, SIGBUS, SIGILL, SIGFPE or SIGABRT.

By design, the crash handler cannot kick in in case the operating system sends
a SIGKILL signal to the arangod process in case of OOM (out of memory).

If possible, the crash handler will also write a backtrace to the logfile, so
the crash location can be found later by the ArangoDB support. In this case,
please provide the entire crash information from the logfile to the ArangoDB
support.

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

The backtrace contains some offsets into the executable, which can be resolved
to source code locations by invoking the `addr2line` utility using the offset
from the backtrace and the very same arangod executable.

For example, to resolve the offset `+0x2036398` from frame 3, addr2line can be
used as follows:

```
addr2line -e build/bin/arangod +0x2036398
```

When invoking addr2line, it is absolutely necessary to use the exact same
executable as when the crash happened. Otherwise the offsets will not match and
invoking addr2line will only produce garbage. In case a release build is used,
it may also be useful to install debug symbols first. Otherwise, addr2line will
likely resolve offsets to just `??:?`.
