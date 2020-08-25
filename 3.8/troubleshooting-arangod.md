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

  ```
  curl --dump - --user "username:password" -X GET http://127.0.0.1:8529/_api/version && echo
  ```

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

The Linux builds of the arangod executable contain a built-in crash handler
(introduced in v3.7.0).

The crash handler is supposed to log basic crash information to the ArangoDB
logfile in case the arangod process receives one of the signals SIGSEGV,
SIGBUS, SIGILL, SIGFPE or SIGABRT. SIGKILL signals, which the operating system
can send to a process in case of OOM (out of memory), are not interceptable and
thus cannot be intercepted by the crash handler.

In case the crash handler receives one of the mentioned interceptable signals,
it will write basic crash information to the logfile and a backtrace of the
call site. The backtrace can be provided to the ArangoDB support for further
inspection. Note that backtaces are only usable if debug symbols for ArangoDB
have been installed as well.

After logging the crash information, the crash handler will execute the default
action for the signal it has caught. If core dumps are enabled, the default
action for these signals is to generate a core file. If core dumps are not
enabled, the crash handler will simply terminate the program with a non-zero
exit code.

The crash handler can be disabled at server start by setting the environment
variable `ARANGODB_OVERRIDE_CRASH_HANDLER` to an empty string, `0` or `off`.

An example log output from the crash handler looks like this:

```
2020-05-26T23:26:10Z [16657] FATAL [a7902] {crash} ArangoDB 3.7.1-devel enterprise [linux], thread 22 [Console] caught unexpected signal 11 (SIGSEGV) accessing address 0x0000000000000000: signal handler invoked
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 1 [0x00007f9124e93ece]: _ZN12_GLOBAL__N_112crashHandlerEiP9siginfo_tPv (+0x000000000000002e)
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 2 [0x00007f912687bfb2]: sigprocmask (+0x0000000000000021)
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 3 [0x00007f9123e08024]: _ZN8arangodb3aql10Expression23executeSimpleExpressionEPKNS0_7AstNodeEPNS_11transaction7MethodsERbb (+0x00000000000001c4)
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 4 [0x00007f9123e08314]: _ZN8arangodb3aql10Expression7executeEPNS0_17ExpressionContextERb (+0x0000000000000064)
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 5 [0x00007f9123feaab2]: _ZN8arangodb3aql19CalculationExecutorILNS0_15CalculationTypeE0EE12doEvaluationERNS0_15InputAqlItemRowERNS0_16OutputAqlItemRowE (+0x0000000000000062)
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 6 [0x00007f9123feae85]: _ZN8arangodb3aql19CalculationExecutorILNS0_15CalculationTypeE0EE11produceRowsERNS0_22AqlItemBlockInputRangeERNS0_16OutputAqlItemRowE (+0x00000000000000f5)
...
2020-05-26T23:26:10Z [16657] INFO [308c3] {crash} frame 31 [0x000018820ffc6d91]: *no symbol name available for this frame
2020-05-26T23:26:10Z [16657] INFO [ded81] {crash} available physical memory: 41721995264, rss usage: 294256640, vsz usage: 1217839104, threads: 46
Segmentation fault (core dumped)
```

The first line of the crash output will contain the cause of the crash
(SIGSEGV in this case). The following lines contain information about the
stack frames. The hexadecimal value presented for each frame is the instruction
pointer, and if debug symbols are installed, there will be name information
about the called procedures (in mangled format) plus the offsets into the
procedures. If no debug symbols are installed, symbol names and offsets cannot
be shown for the stack frames.
