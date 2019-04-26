---
layout: default
description: You want to modify sources or add your own changes to ArangoDB
---
Compiling ArangoDB
==================

Problem
-------

You want to modify sources or add your own changes to ArangoDB.

Solution
--------

Arangodb, as many other opensource projects nowadays is standing on the shoulder of giants.
This gives us a solid foundation to bring you a uniq feature set, but it introduces a lot of
dependencies that need to be in place in order to compile arangodb.

Since build infrastructures are very different depending on the target OS, choose your target
from the recepies below.

- [Compile on Debian](compiling-debian.html)

- [Compile on Windows](compiling-windows.html)

- [Running Custom Build](compiling-running-custom-build.html)

  - [Recompiling jemalloc](compiling-jemalloc.html)

  - [OpenSSL 1.1](compiling-open-ssl.html)
