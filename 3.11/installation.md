---
layout: default
description: To install ArangoDB, as first step, please download the package for your OperatingSystem from the official Download page of the ArangoDB web site
---
Installation
============

To install ArangoDB, as first step, please download a package for your operating
system from the official [Download](https://www.arangodb.com/download){:target="_blank"}
page of the ArangoDB web site.

You can find packages for various operating systems, including _RPM_ and _Debian_
packages for Linux, and _dmg_ packages for macOS. `tar.gz` archives are available
for both. For Windows, _Installers_ and `zip` archives are available.

- [Linux](installation-linux.html)
- [macOS](installation-mac-osx.html)
- [Windows](installation-windows.html)

{% hint 'tip' %}
You can also use the official [Docker images](https://hub.docker.com/_/arangodb/){:target="_blank"}
to run ArangoDB in containers on Linux, macOS, and Windows. For more information,
see the [Docker](install-with-docker.html) section.
{% endhint %}

If you prefer to compile ArangoDB from source, please refer to the [Compiling](installation-compiling.html)
_Section_.

For detailed information on how to deploy ArangoDB, once it has been installed,
please refer to the [Deployment](architecture-deployment-modes.html) chapter.

## Supported platforms and architectures

Work with ArangoDB on Linux, macOS, and Windows, and run it in production on Linux.

{% hint 'tip' %}
[ArangoGraph Insights Platform](https://cloud.arangodb.com/){:target="_blank"}
is a fully-managed service and requires no installation. It's the easiest way
to run ArangoDB in the cloud.
{% endhint %}

### Linux

ArangoDB is available for the following architectures:

- **x86-64**: The processor(s) must support the **x86-64** architecture with the
  **SSE 4.2** and **AVX** instruction set extensions (Intel Sandy Bridge or better,
  AMD Bulldozer or better, etc.).
- **ARM**: The processor(s) must be 64-bit ARM chips (**AArch64**). The minimum
  requirement is **ARMv8** with **Neon** (SIMD extension). A system with Little
  Endian byte order is required.

## macOS

ArangoDB is available for the following architectures:

- **x86-64**: The processor(s) must support the **x86-64** architecture with the
  **SSE 4.2** and **AVX** instruction set extensions (Intel Sandy Bridge or better,
  AMD Bulldozer or better, etc.).
- **ARM**: The processor(s) must be 64-bit Apple silicon (**M1** or later) based on
  ARM (**AArch64**). 

## Windows  

ArangoDB is available for the following architectures:

- **x86-64**: The processor(s) must support the **x86-64** architecture with the
  **SSE 4.2** and **AVX** instruction set extensions (Intel Sandy Bridge or better,
  AMD Bulldozer or better, etc.).