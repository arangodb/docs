---
layout: default
description: ArangoDB can be compiled directly from source code
title: Compile ArangoDB
---
Compiling ArangoDB from Source
===============================

ArangoDB can be compiled directly from source. It will compile on most Linux
and macOS systems, as well as on Windows.

We assume that you use the GNU C/C++ compiler or clang/clang++ to compile the
source. ArangoDB has been tested with these compilers, but should be able to
compile with any Posix-compliant, C++14-enabled compiler. For our Windows
builds we use Microsoft's Visual C++ 2017 compiler.

By default, cloning the GitHub repository will checkout the _devel_ branch.
This branch contains the development version of the ArangoDB. Use this branch
if you want to make changes to the ArangoDB source.

- [Compile on Debian](installation-compiling-debian.html)

- [Compile on Windows](installation-compiling-windows.html)

- [Running Custom Build](installation-compiling-running-custom-build.html)

- [Recompiling jemalloc](installation-compiling-jemalloc.html)
